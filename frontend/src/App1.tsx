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

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [isAdmin, setIsAdmin] = useState(false)
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState('')

  // ── Auth ──────────────────────────────────────────────
  const handleLogin = () => {
    if (pwInput === ADMIN_PASSWORD) { setIsAdmin(true); setPage('admin'); setPwError('') }
    else setPwError('Sai mật khẩu!')
  }

  const nav = (p: Page) => {
    if (p === 'admin' && !isAdmin) { setPage('login' as Page); return }
    setPage(p)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar page={page} setPage={setPage} isAdmin={isAdmin}
        onLogout={() => { setIsAdmin(false); setPage('home') }} nav={nav} />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '30px 16px' }}>
        {page === 'home' && <HomePage setPage={setPage} nav={nav} />}
        {page === 'list' && <EmployeeList isAdmin={false} />}
        {page === 'admin' && isAdmin && <EmployeeList isAdmin={true} />}
        {(page as string) === 'login' && (
          <div style={{ maxWidth: 360, margin: '80px auto', background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#1565c0', marginBottom: 24 }}>🔐 Đăng nhập Admin</h2>
            <input type="password" placeholder="Nhập mật khẩu..." value={pwInput}
              onChange={e => setPwInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '10px 14px', border: '2px solid #1976d2', borderRadius: 8, fontSize: 15, boxSizing: 'border-box' }} />
            {pwError && <p style={{ color: 'red', marginTop: 8 }}>{pwError}</p>}
            <button onClick={handleLogin}
              style={{ width: '100%', marginTop: 16, padding: '11px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer' }}>
              Đăng nhập
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── NAVBAR ────────────────────────────────────────────────
function Navbar({ page, setPage, isAdmin, onLogout, nav }: any) {
  return (
    <nav style={{ background: '#1565c0', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
      <span style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginRight: 16, padding: '14px 0' }}>👥 EmpManager</span>
      {[
        { label: '🏠 Trang chủ', p: 'home' },
        { label: '📋 Danh sách', p: 'list' },
        { label: '⚙️ Quản lý', p: isAdmin ? 'admin' : 'login' },
      ].map(({ label, p }) => (
        <button key={p} onClick={() => setPage(p)}
          style={{ padding: '14px 16px', background: page === p ? '#0d47a1' : 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, borderBottom: page === p ? '3px solid #90caf9' : '3px solid transparent' }}>
          {label}
        </button>
      ))}
      {isAdmin && (
        <button onClick={onLogout}
          style={{ marginLeft: 'auto', padding: '8px 16px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Đăng xuất
        </button>
      )}
    </nav>
  )
}

// ── TRANG CHỦ ────────────────────────────────────────────
function HomePage({ setPage, nav }: any) {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1565c0, #42a5f5)', borderRadius: 16, padding: '48px 32px', color: '#fff', textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>👥 Hệ thống Quản lý Nhân viên</h1>
        <p style={{ fontSize: 18, opacity: 0.9, marginBottom: 28 }}>Ứng dụng quản lý nhân viên hiện đại với React + TypeScript + Supabase</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setPage('list')}
            style={{ padding: '12px 28px', background: '#fff', color: '#1565c0', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}>
            📋 Xem danh sách
          </button>
          <button onClick={() => setPage('login')}
            style={{ padding: '12px 28px', background: 'transparent', color: '#fff', border: '2px solid #fff', borderRadius: 8, fontSize: 16, cursor: 'pointer' }}>
            ⚙️ Vào trang Admin
          </button>
        </div>
      </div>

      {/* Tech stack */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { icon: '⚛️', title: 'React + TypeScript', desc: 'Xây dựng UI component-based, type-safe, dễ bảo trì' },
          { icon: '🗄️', title: 'Supabase Backend', desc: 'Database PostgreSQL + Storage + REST API tự động' },
          { icon: '⚡', title: 'Vite Build Tool', desc: 'HMR cực nhanh, build production tối ưu' },
          { icon: '🔐', title: 'Admin Protection', desc: 'Trang quản lý được bảo vệ bằng mật khẩu' },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
            <h3 style={{ color: '#1565c0', marginBottom: 8 }}>{title}</h3>
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.5 }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Các bước */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h2 style={{ color: '#1565c0', marginBottom: 20 }}>📌 Các bước xây dựng dự án</h2>
        {[
          { step: '01', title: 'Tạo Supabase Project', desc: 'Đăng ký tài khoản, tạo project, lấy Project URL và API Key' },
          { step: '02', title: 'Thiết kế bảng Employee', desc: 'Tạo bảng với các cột: id, created_at, name, avatar. Import dữ liệu mẫu qua CSV' },
          { step: '03', title: 'Cấu hình Storage & Policy', desc: 'Tạo bucket "avatars" (public), thêm RLS policy cho SELECT/INSERT/UPDATE/DELETE' },
          { step: '04', title: 'Khởi tạo React TypeScript', desc: 'Dùng Vite tạo project, cài @supabase/supabase-js, cấu hình .env bảo mật' },
          { step: '05', title: 'Xây dựng giao diện', desc: 'Trang chủ, danh sách nhân viên, trang admin với CRUD đầy đủ, tìm kiếm, upload ảnh' },
        ].map(({ step, title, desc }) => (
          <div key={step} style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'flex-start' }}>
            <div style={{ minWidth: 40, height: 40, background: '#1976d2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: 13 }}>{step}</div>
            <div>
              <strong style={{ color: '#1565c0' }}>{title}</strong>
              <p style={{ color: '#555', margin: '4px 0 0', fontSize: 14 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── EMPLOYEE LIST (dùng cho cả list và admin) ─────────────
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

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
  }

  const filtered = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))

  // Upload ảnh lên Storage
  const uploadAvatar = async (file: File, filename: string) => {
    const { error } = await supabase.storage.from('avatars').upload(filename, file, { upsert: true })
    if (error) throw error
    return filename
  }

  // Thêm nhân viên
  const handleAdd = async () => {
    if (!newName.trim()) return alert('Vui lòng nhập tên!')
    if (!newAvatarFile) return alert('Vui lòng chọn ảnh!')
    setSaving(true)
    try {
      const filename = `avatar_${Date.now()}.jpg`
      await uploadAvatar(newAvatarFile, filename)
      const { error } = await supabase.from('employee').insert({ name: newName, avatar: filename })
      if (error) throw error
      setShowAdd(false); setNewName(''); setNewAvatarFile(null); setNewAvatarPreview('')
      fetchEmployees()
    } catch (e: any) { alert('Lỗi: ' + e.message) }
    setSaving(false)
  }

  // Xóa nhân viên
  const handleDelete = async (emp: Employee) => {
    if (!confirm(`Xóa nhân viên "${emp.name}"?`)) return
    const { error } = await supabase.from('employee').delete().eq('id', emp.id)
    if (error) return alert('Lỗi: ' + error.message)
    fetchEmployees()
  }

  // Lưu chỉnh sửa
  const handleSave = async (emp: Employee) => {
    if (!editName.trim()) return alert('Tên không được để trống!')
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
    } catch (e: any) { alert('Lỗi: ' + e.message) }
    setSaving(false)
  }

  const onEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setEditAvatarFile(f)
    setEditAvatarPreview(URL.createObjectURL(f))
  }

  const onNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setNewAvatarFile(f)
    setNewAvatarPreview(URL.createObjectURL(f))
  }

  if (loading) return <div style={{ textAlign: 'center', marginTop: 60, fontSize: 20 }}>⏳ Đang tải...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ color: '#1565c0', margin: 0 }}>
          {isAdmin ? '⚙️ Quản lý nhân viên' : '📋 Danh sách nhân viên'}
          <span style={{ marginLeft: 10, fontSize: 14, color: '#888', fontWeight: 'normal' }}>({filtered.length} người)</span>
        </h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input placeholder="🔍 Tìm theo tên..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 14px', border: '2px solid #1976d2', borderRadius: 8, fontSize: 14, width: 220 }} />
          {isAdmin && (
            <button onClick={() => setShowAdd(!showAdd)}
              style={{ padding: '9px 18px', background: '#388e3c', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 'bold' }}>
              ➕ Thêm nhân viên
            </button>
          )}
        </div>
      </div>

      {/* Form thêm nhân viên */}
      {isAdmin && showAdd && (
        <div style={{ background: '#e3f2fd', borderRadius: 12, padding: 20, marginBottom: 20, border: '2px solid #1976d2' }}>
          <h3 style={{ color: '#1565c0', marginTop: 0 }}>➕ Thêm nhân viên mới</h3>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <input placeholder="Nhập tên nhân viên..." value={newName} onChange={e => setNewName(e.target.value)}
              style={{ padding: '8px 14px', border: '2px solid #1976d2', borderRadius: 8, fontSize: 14, flex: 1, minWidth: 200 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {newAvatarPreview && <img src={newAvatarPreview} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #1976d2' }} />}
              <button onClick={() => newFileRef.current?.click()}
                style={{ padding: '8px 14px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                📷 Chọn ảnh
              </button>
              <input ref={newFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onNewFileChange} />
            </div>
            <button onClick={handleAdd} disabled={saving}
              style={{ padding: '8px 18px', background: '#388e3c', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>
              {saving ? '⏳ Đang lưu...' : '💾 Lưu'}
            </button>
            <button onClick={() => { setShowAdd(false); setNewName(''); setNewAvatarFile(null); setNewAvatarPreview('') }}
              style={{ padding: '8px 14px', background: '#757575', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              ✕ Hủy
            </button>
          </div>
        </div>
      )}

      {/* Bảng nhân viên */}
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1976d2', color: '#fff' }}>
              <th style={th}>ID</th>
              <th style={th}>Ngày tạo</th>
              <th style={th}>Tên</th>
              <th style={th}>Avatar</th>
              {isAdmin && <th style={th}>Hành động</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: 40, color: '#888' }}>Không tìm thấy nhân viên nào.</td></tr>
            ) : filtered.map((emp, idx) => (
              <tr key={emp.id} style={{ background: idx % 2 === 0 ? '#f9f9f9' : '#fff', borderBottom: '1px solid #eee' }}>
                <td style={td}>{emp.id}</td>
                <td style={td}>{formatDate(emp.created_at)}</td>
                <td style={td}>
                  {isAdmin && editId === emp.id
                    ? <input value={editName} onChange={e => setEditName(e.target.value)} autoFocus
                        style={{ padding: '6px 10px', border: '2px solid #1976d2', borderRadius: 6, fontSize: 14, width: 160 }} />
                    : <strong>{emp.name}</strong>}
                </td>
                <td style={td}>
                  {isAdmin && editId === emp.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={editAvatarPreview || getAvatarUrl(emp.avatar)} alt={emp.name}
                        style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #1976d2' }} />
                      <button onClick={() => editFileRef.current?.click()}
                        style={{ padding: '4px 10px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                        📷 Đổi ảnh
                      </button>
                      <input ref={editFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onEditFileChange} />
                    </div>
                  ) : (
                    <img src={getAvatarUrl(emp.avatar)} alt={emp.name}
                      style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e0e0e0' }} />
                  )}
                </td>
                {isAdmin && (
                  <td style={td}>
                    {editId === emp.id ? (
                      <>
                        <button onClick={() => handleSave(emp)} disabled={saving}
                          style={{ ...btnBase, background: '#388e3c' }}>{saving ? '⏳' : '💾 Lưu'}</button>
                        <button onClick={() => { setEditId(null); setEditAvatarFile(null); setEditAvatarPreview('') }}
                          style={{ ...btnBase, background: '#757575' }}>✕ Hủy</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditId(emp.id); setEditName(emp.name) }}
                          style={{ ...btnBase, background: '#f57c00' }}>✏️ Sửa</button>
                        <button onClick={() => handleDelete(emp)}
                          style={{ ...btnBase, background: '#d32f2f' }}>🗑️ Xóa</button>
                      </>
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

const th: React.CSSProperties = { padding: '14px 16px', textAlign: 'left', fontWeight: 'bold' }
const td: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'middle' }
const btnBase: React.CSSProperties = { padding: '6px 12px', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', marginRight: 6, fontSize: 13 }