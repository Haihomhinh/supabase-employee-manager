import { useEffect, useState, useRef } from 'react'
import { supabase, getAvatarUrl } from './supabaseClient'

interface Employee {
  id: number
  created_at: string
  name: string
  avatar: string
}

type Page = 'home' | 'list' | 'admin'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

// --- CẤU HÌNH MÀU SẮC ---
const COLORS = {
  primary: '#6366f1', 
  secondary: '#a855f7', 
  bgGradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  text: '#1e293b',
  accent: '#f43f5e'
}

const GLOBAL_FONT = '"Times New Roman", Times, serif'

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [isAdmin, setIsAdmin] = useState(false)
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState('')

  const handleLogin = () => {
    if (pwInput === ADMIN_PASSWORD) { 
      setIsAdmin(true)
      setPage('admin')
      setPwError('') 
    } else {
      setPwError('Mật khẩu không chính xác!')
    }
  }

  const nav = (p: Page) => {
    if (p === 'admin' && !isAdmin) { setPage('login' as Page); return }
    setPage(p)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: COLORS.bgGradient, 
      fontFamily: GLOBAL_FONT, 
      color: COLORS.text,
      fontWeight: 'normal'
    }}>
      <Navbar page={page} setPage={setPage} isAdmin={isAdmin}
        onLogout={() => { setIsAdmin(false); setPage('home') }} />
      
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>
        {page === 'home' && <HomePage setPage={setPage} />}
        {page === 'list' && <EmployeeList isAdmin={false} />}
        {page === 'admin' && isAdmin && <EmployeeList isAdmin={true} />}
        
        {(page as string) === 'login' && (
          <div style={{ 
            maxWidth: 400, 
            margin: '80px auto', 
            background: 'rgba(255, 255, 255, 0.9)', 
            borderRadius: 24, 
            padding: 40, 
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #fff'
          }}>
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <span style={{ fontSize: 40 }}>🔐</span>
              <h2 style={{ fontSize: 28, fontWeight: 'normal', marginTop: 15 }}>Admin Access</h2>
            </div>
            <input type="password" placeholder="Nhập mật khẩu..." value={pwInput}
              onChange={e => setPwInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ 
                width: '100%', padding: '14px 18px', border: '1.5px solid #e2e8f0', 
                borderRadius: 12, fontSize: 16, outline: 'none', boxSizing: 'border-box',
                fontFamily: GLOBAL_FONT
              }} />
            {pwError && <p style={{ color: COLORS.accent, marginTop: 10, fontSize: 15 }}>{pwError}</p>}
            <button onClick={handleLogin}
              style={{ 
                width: '100%', marginTop: 24, padding: '14px', background: COLORS.primary, 
                color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, 
                fontWeight: 'normal', cursor: 'pointer', transition: '0.3s',
                fontFamily: GLOBAL_FONT, boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.4)' 
              }}>
              Đăng nhập hệ thống
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── NAVBAR ────────────────────────────────────────────────
function Navbar({ page, setPage, isAdmin, onLogout }: any) {
  return (
    <nav style={{ 
      background: 'rgba(255, 255, 255, 0.7)', 
      backdropFilter: 'blur(10px)', 
      position: 'sticky', top: 0, zIndex: 100,
      padding: '12px 40px', display: 'flex', alignItems: 'center', 
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', 
      borderBottom: '1px solid rgba(255,255,255,0.3)' 
    }}>
      <span style={{ 
        fontSize: 24, fontWeight: 'normal', 
        background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.secondary})`, 
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', 
        marginRight: 40 
      }}>EmpManager.</span>
      
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { label: 'Trang chủ', p: 'home' },
          { label: 'Danh sách', p: 'list' },
          { label: 'Quản lý', p: isAdmin ? 'admin' : 'login' },
        ].map(({ label, p }) => (
          <button key={p} onClick={() => setPage(p as Page)}
            style={{ 
              padding: '10px 20px', 
              background: page === p ? COLORS.primary : 'transparent', 
              color: page === p ? '#fff' : COLORS.text, 
              border: 'none', borderRadius: 12, cursor: 'pointer', 
              fontSize: 16, fontWeight: 'normal', transition: '0.3s',
              fontFamily: GLOBAL_FONT
            }}>
            {label}
          </button>
        ))}
      </div>

      {isAdmin && (
        <button onClick={onLogout}
          style={{ 
            marginLeft: 'auto', padding: '8px 20px', background: 'rgba(244, 63, 94, 0.1)', 
            color: COLORS.accent, border: 'none', borderRadius: 10, cursor: 'pointer', 
            fontWeight: 'normal', fontFamily: GLOBAL_FONT
          }}>
          Đăng xuất
        </button>
      )}
    </nav>
  )
}

// ── HOMEPAGE ──────────────────────────────────────────────
function HomePage({ setPage }: any) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, padding: '40px 0 60px 0', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <h1 style={{ fontSize: 48, fontWeight: 'normal', lineHeight: 1.2, marginBottom: 20 }}>
            Hệ thống Quản lý <br/>
            <span style={{ background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Nhân viên Hiện đại</span>
          </h1>
          <p style={{ fontSize: 19, color: '#64748b', marginBottom: 35, maxWidth: 550, lineHeight: 1.6 }}>
            Ứng dụng quản lý nhân sự tối ưu hóa quy trình, được xây dựng với React, TypeScript và tích hợp dữ liệu đám mây Supabase.
          </p>
          <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
            <button onClick={() => setPage('list')}
              style={{ padding: '16px 32px', background: COLORS.primary, color: '#fff', border: 'none', borderRadius: 14, fontSize: 17, cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)', fontFamily: GLOBAL_FONT }}>
              📋 Xem danh sách
            </button>
            <button onClick={() => setPage('login' as Page)}
              style={{ padding: '16px 32px', background: '#fff', color: COLORS.text, border: '1px solid #e2e8f0', borderRadius: 14, fontSize: 17, cursor: 'pointer', fontFamily: GLOBAL_FONT }}>
              ⚙️ Truy cập Quản lý
            </button>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 300 }}>
           <div className="blob" style={{ width: 320, height: 320, background: `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.secondary})`, borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', animation: 'morph 8s ease-in-out infinite', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 100 }}>
              🐳
           </div>
        </div>
      </div>

      <style>{`
        @keyframes morph {
          0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
          100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
        }
      `}</style>

      {/* Tech Stack Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 50 }}>
        {[
          { icon: '⚛️', title: 'React + TypeScript', desc: 'Xây dựng UI component-based, type-safe, dễ bảo trì' },
          { icon: '🗄️', title: 'Supabase Backend', desc: 'Database PostgreSQL + Storage + REST API tự động' },
          { icon: '⚡', title: 'Vite Build Tool', desc: 'HMR cực nhanh, build production tối ưu' },
          { icon: '🔐', title: 'Admin Protection', desc: 'Trang quản lý được bảo vệ bằng mật khẩu' },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: 30, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #fff' }}>
            <div style={{ fontSize: 36, marginBottom: 15 }}>{icon}</div>
            <h3 style={{ fontSize: 20, fontWeight: 'normal', marginBottom: 10, color: COLORS.primary }}>{title}</h3>
            <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.6, margin: 0 }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Project Steps Section */}
      <div style={{ background: '#fff', borderRadius: 24, padding: 40, boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 35 }}>
          <span style={{ fontSize: 28 }}>📌</span>
          <h2 style={{ fontSize: 26, fontWeight: 'normal', color: COLORS.text, margin: 0 }}>Các bước xây dựng dự án</h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
          {[
            { step: '01', title: 'Tạo Supabase Project', desc: 'Đăng ký tài khoản, tạo project, lấy Project URL và API Key' },
            { step: '02', title: 'Thiết kế bảng Employee', desc: 'Tạo bảng với các cột: id, created_at, name, avatar. Import dữ liệu mẫu qua CSV' },
            { step: '03', title: 'Cấu hình Storage & Policy', desc: 'Tạo bucket "avatars" (public), thêm RLS policy cho SELECT/INSERT/UPDATE/DELETE' },
            { step: '04', title: 'Khởi tạo React TypeScript', desc: 'Dùng Vite tạo project, cài @supabase/supabase-js, cấu hình .env bảo mật' },
            { step: '05', title: 'Xây dựng giao diện', desc: 'Trang chủ, danh sách nhân viên, trang admin với CRUD đầy đủ, tìm kiếm, upload ảnh' },
          ].map(({ step, title, desc }) => (
            <div key={step} style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              <div style={{ 
                minWidth: 45, height: 45, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, 
                borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                color: '#fff', fontSize: 18, boxShadow: '0 8px 15px -3px rgba(99, 102, 241, 0.4)' 
              }}>
                {step}
              </div>
              <div>
                <h4 style={{ fontSize: 20, fontWeight: 'normal', color: COLORS.text, marginBottom: 6, marginTop: 0 }}>{title}</h4>
                <p style={{ color: '#64748b', fontSize: 17, margin: 0, lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── EMPLOYEE LIST ─────────────────────────────────────────
// ── EMPLOYEE LIST ─────────────────────────────────────────
function EmployeeList({ isAdmin }: { isAdmin: boolean }) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null)
  const [editAvatarPreview, setEditAvatarPreview] = useState<string>('')
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null)
  const [newAvatarPreview, setNewAvatarPreview] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const editFileRef = useRef<HTMLInputElement>(null)
  const newFileRef = useRef<HTMLInputElement>(null)

  const fetchEmployees = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('employee').select('*').order('id')
    if (error) console.error(error)
    else setEmployees(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchEmployees() }, [])

  // TÍNH NĂNG MỚI: Tìm kiếm theo cả tên (name) HOẶC mã nhân viên (id)
  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.id.toString().includes(search)
  )

  const uploadAvatar = async (file: File, filename: string) => {
    const { error } = await supabase.storage.from('avatars').upload(filename, file)
    if (error) throw error
    return filename
  }

  const handleAdd = async () => {
    if (!newName.trim() || !newAvatarFile) return alert('Vui lòng điền đủ thông tin!')
    setSaving(true)
    try {
      const filename = `avatar_${Date.now()}.jpg`
      await uploadAvatar(newAvatarFile, filename)
      const { error } = await supabase.from('employee').insert({ name: newName, avatar: filename })
      if (error) throw error
      setShowAdd(false); setNewName(''); setNewAvatarFile(null); setNewAvatarPreview('')
      fetchEmployees()
    } catch (e: any) { alert(e.message) }
    setSaving(false)
  }

  const handleDelete = async (emp: Employee) => {
    if (!confirm(`Xóa nhân viên ${emp.name}?`)) return
    const { error } = await supabase.from('employee').delete().eq('id', emp.id)
    if (error) return alert(error.message)
    fetchEmployees()
  }

  const handleSave = async (emp: Employee) => {
    setSaving(true)
    try {
      let avatarName = emp.avatar
      if (editAvatarFile) {
        avatarName = `avatar_${Date.now()}.jpg`
        await uploadAvatar(editAvatarFile, avatarName)
      }
      const { error } = await supabase.from('employee').update({ name: editName, avatar: avatarName }).eq('id', emp.id)
      if (error) throw error
      setEditId(null); setEditAvatarFile(null); setEditAvatarPreview('')
      fetchEmployees()
    } catch (e: any) { alert(e.message) }
    setSaving(false)
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 100, fontSize: 20 }}>Đang tải dữ liệu...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h2 style={{ fontSize: 32, fontWeight: 'normal' }}>{isAdmin ? 'Quản lý nhân sự' : 'Danh sách nhân viên'}</h2>
        <div style={{ display: 'flex', gap: 15 }}>
          {/* Đã sửa Placeholder để thể hiện rõ có thể tìm bằng ID */}
          <input placeholder="Tìm kiếm tên hoặc ID..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '12px 20px', borderRadius: 14, border: '1px solid #e2e8f0', width: 250, outline: 'none', fontFamily: GLOBAL_FONT }} />
          {isAdmin && (
            <button onClick={() => setShowAdd(!showAdd)}
              style={{ padding: '12px 24px', background: COLORS.primary, color: '#fff', border: 'none', borderRadius: 14, cursor: 'pointer', fontFamily: GLOBAL_FONT }}>
              + Thêm mới
            </button>
          )}
        </div>
      </div>

      {isAdmin && showAdd && (
        <div style={{ background: '#fff', borderRadius: 20, padding: 30, marginBottom: 30, border: `2px dashed ${COLORS.primary}`, display: 'flex', gap: 20, alignItems: 'center' }}>
          <div onClick={() => newFileRef.current?.click()} style={{ width: 80, height: 80, borderRadius: 15, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}>
            {newAvatarPreview ? <img src={newAvatarPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>📷</span>}
          </div>
          <input ref={newFileRef} type="file" style={{ display: 'none' }} onChange={(e) => {
            const f = e.target.files?.[0]; if (f) { setNewAvatarFile(f); setNewAvatarPreview(URL.createObjectURL(f)) }
          }} />
          <input placeholder="Họ và tên..." value={newName} onChange={e => setNewName(e.target.value)}
            style={{ flex: 1, padding: '12px 20px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 16, fontFamily: GLOBAL_FONT }} />
          <button onClick={handleAdd} disabled={saving} style={{ padding: '12px 30px', background: COLORS.primary, color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: GLOBAL_FONT }}>
            {saving ? '⏳' : 'Lưu nhân viên'}
          </button>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
              <th style={thStyle}>STT</th> {/* Đã thêm cột Số thứ tự mượt mà */}
              <th style={thStyle}>
                Nhân viên <span style={{ color: COLORS.primary, fontWeight: 'bold' }}>({filtered.length})</span>
              </th> {/* Đã thêm số lượng đếm được */}
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Ngày gia nhập</th>
              {isAdmin && <th style={thStyle}>Hành động</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Không tìm thấy nhân viên phù hợp</td></tr>
            ) : filtered.map((emp, index) => (
              <tr key={emp.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{...tdStyle, color: '#94a3b8'}}>{index + 1}</td> {/* Hiển thị STT luôn liền mạch */}
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    <img src={getAvatarUrl(emp.avatar)} style={{ width: 50, height: 50, borderRadius: 12, objectFit: 'cover' }} />
                    {editId === emp.id ? (
                      <input value={editName} onChange={e => setEditName(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #6366f1', fontFamily: GLOBAL_FONT }} />
                    ) : (
                      <span style={{ fontSize: 17 }}>{emp.name}</span>
                    )}
                  </div>
                </td>
                <td style={tdStyle}>#{emp.id}</td>
                <td style={tdStyle}>{new Date(emp.created_at).toLocaleDateString('vi-VN')}</td>
                {isAdmin && (
                  <td style={tdStyle}>
                    {editId === emp.id ? (
                      <button onClick={() => handleSave(emp)} style={{ ...actionBtn, background: COLORS.primary, color: '#fff' }}>Lưu</button>
                    ) : (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => { setEditId(emp.id); setEditName(emp.name) }} style={{ ...actionBtn, background: '#f1f5f9', color: COLORS.text }}>Sửa</button>
                        <button onClick={() => handleDelete(emp)} style={{ ...actionBtn, background: 'rgba(244, 63, 94, 0.1)', color: COLORS.accent }}>Xóa</button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = { padding: '20px 24px', textAlign: 'left', fontWeight: 'normal', color: '#64748b' }
const tdStyle: React.CSSProperties = { padding: '16px 24px' }
const actionBtn: React.CSSProperties = { padding: '8px 16px', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: GLOBAL_FONT }