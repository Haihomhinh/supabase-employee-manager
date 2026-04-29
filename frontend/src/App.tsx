import { useEffect, useState } from 'react'
import { supabase, getAvatarUrl } from './supabaseClient'

interface Employee {
  id: number
  created_at: string
  name: string
  avatar: string
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  const fetchEmployees = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('employee')
      .select('*')
      .order('id')
    if (error) console.error('Lỗi fetch:', error)
    else setEmployees(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchEmployees() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa nhân viên này?')) return
    const { error } = await supabase.from('employee').delete().eq('id', id)
    if (error) alert('Lỗi khi xóa: ' + error.message)
    else fetchEmployees()
  }

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) { alert('Tên không được để trống!'); return }
    const { error } = await supabase
      .from('employee')
      .update({ name: editName })
      .eq('id', id)
    if (error) alert('Lỗi khi cập nhật: ' + error.message)
    else { setEditId(null); setEditName(''); fetchEmployees() }
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  }

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: 80, fontSize: 22 }}>
      ⏳ Đang tải dữ liệu...
    </div>
  )

  return (
    <div style={{ maxWidth: 950, margin: '30px auto', fontFamily: 'Arial, sans-serif', padding: '0 16px' }}>
      <h1 style={{ textAlign: 'center', color: '#1565c0', marginBottom: 24 }}>
        👥 Danh sách nhân viên
      </h1>

      {employees.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Không có dữ liệu.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ backgroundColor: '#1976d2', color: '#fff' }}>
              <th style={th}>ID</th>
              <th style={th}>Ngày tạo</th>
              <th style={th}>Tên</th>
              <th style={th}>Avatar</th>
              <th style={th}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => (
              <tr key={emp.id}
                style={{ backgroundColor: idx % 2 === 0 ? '#f5f5f5' : '#fff', borderBottom: '1px solid #ddd' }}>
                <td style={td}>{emp.id}</td>
                <td style={td}>{formatDate(emp.created_at)}</td>
                <td style={td}>
                  {editId === emp.id ? (
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      style={{ padding: '6px 10px', border: '2px solid #1976d2', borderRadius: 4, fontSize: 14, width: 160 }}
                      autoFocus
                    />
                  ) : emp.name}
                </td>
                <td style={td}>
                  <img
                    src={getAvatarUrl(emp.avatar)}
                    alt={emp.name}
                    style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #1976d2' }}
                  />
                </td>
                <td style={td}>
                  {editId === emp.id ? (
                    <>
                      <button onClick={() => handleUpdate(emp.id)} style={btnGreen}>💾 Lưu</button>
                      <button onClick={() => setEditId(null)} style={btnGray}>✕ Hủy</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditId(emp.id); setEditName(emp.name) }} style={btnOrange}>✏️ Sửa</button>
                      <button onClick={() => handleDelete(emp.id)} style={btnRed}>🗑️ Xóa</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const th: React.CSSProperties = { padding: '12px 16px', textAlign: 'left', fontWeight: 'bold' }
const td: React.CSSProperties = { padding: '10px 16px', verticalAlign: 'middle' }
const base: React.CSSProperties = { padding: '6px 12px', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', marginRight: 6, fontSize: 13 }
const btnOrange: React.CSSProperties = { ...base, backgroundColor: '#f57c00' }
const btnRed: React.CSSProperties = { ...base, backgroundColor: '#d32f2f' }
const btnGreen: React.CSSProperties = { ...base, backgroundColor: '#388e3c' }
const btnGray: React.CSSProperties = { ...base, backgroundColor: '#757575' }

export default App