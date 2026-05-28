import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { ProTable, Button, Badge, Avatar, toast } from '@dangbt/pro-ui'
import type { ProColumnType } from '@dangbt/pro-ui'

interface User {
  id: string; name: string; email: string; role: string
  status: 'active' | 'inactive' | 'pending'; joined: string; orders: number
}

const USERS: User[] = [
  { id: '1', name: 'Alice Nguyen',  email: 'alice@example.com',  role: 'Admin',  status: 'active',   joined: '2024-01-15', orders: 24 },
  { id: '2', name: 'Bob Tran',      email: 'bob@example.com',    role: 'Editor', status: 'active',   joined: '2024-02-20', orders: 8  },
  { id: '3', name: 'Carol Le',      email: 'carol@example.com',  role: 'Viewer', status: 'pending',  joined: '2024-03-05', orders: 0  },
  { id: '4', name: 'David Pham',    email: 'david@example.com',  role: 'Editor', status: 'active',   joined: '2024-03-18', orders: 12 },
  { id: '5', name: 'Emma Hoang',    email: 'emma@example.com',   role: 'Viewer', status: 'inactive', joined: '2024-04-02', orders: 3  },
  { id: '6', name: 'Frank Vo',      email: 'frank@example.com',  role: 'Editor', status: 'active',   joined: '2024-04-14', orders: 17 },
  { id: '7', name: 'Grace Dang',    email: 'grace@example.com',  role: 'Admin',  status: 'active',   joined: '2024-05-01', orders: 31 },
  { id: '8', name: 'Henry Bui',     email: 'henry@example.com',  role: 'Viewer', status: 'pending',  joined: '2024-05-22', orders: 0  },
  { id: '9', name: 'Iris Luu',      email: 'iris@example.com',   role: 'Editor', status: 'active',   joined: '2024-06-08', orders: 9  },
  { id: '10',name: 'Jack Dinh',     email: 'jack@example.com',   role: 'Viewer', status: 'inactive', joined: '2024-06-19', orders: 2  },
]

const columns: ProColumnType<User>[] = [
  {
    title: 'User',
    dataIndex: 'name',
    key: 'name',
    disableHiding: true,
    render: (_, row) => (
      <div className="flex items-center gap-2.5">
        <Avatar name={row.name} size="sm" />
        <div>
          <div className="text-sm font-medium text-fg">{row.name}</div>
          <div className="text-xs text-fg-muted">{row.email}</div>
        </div>
      </div>
    ),
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    valueType: 'select',
    valueEnum: { Admin: 'Admin', Editor: 'Editor', Viewer: 'Viewer' },
    render: (v) => (
      <Badge size="sm" color={(v as string) === 'Admin' ? 'primary' : (v as string) === 'Editor' ? 'info' : 'default'}>{v as string}</Badge>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    valueType: 'select',
    valueEnum: { active: 'Active', inactive: 'Inactive', pending: 'Pending' },
    render: (v) => (
      <Badge size="sm" color={(v as string) === 'active' ? 'success' : (v as string) === 'pending' ? 'warning' : 'danger'}>{v as string}</Badge>
    ),
  },
  { title: 'Joined',  dataIndex: 'joined', key: 'joined', valueType: 'date', sortable: true },
  { title: 'Orders',  dataIndex: 'orders', key: 'orders', valueType: 'number', sortable: true, align: 'right' },
  {
    title: 'Actions',
    dataIndex: 'id',
    key: 'actions',
    hideInSearch: true,
    disableHiding: true,
    render: (_, row) => (
      <div className="flex items-center gap-1">
        <Button size="sm" variant="ghost" onPress={() => toast.info(`Editing ${row.name}`)}>Edit</Button>
        <Button size="sm" variant="danger" onPress={() => toast.error(`Deleted ${row.name}`)}>Delete</Button>
      </div>
    ),
  },
]

export default function Users() {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fg">Users</h1>
          <p className="text-sm text-fg-muted mt-1">{USERS.length} total users</p>
        </div>
        <Button variant="primary" onPress={() => toast.success('Add user modal would open here')}>
          <UserPlus className="w-4 h-4" />
          Add user
        </Button>
      </div>

      <ProTable<User>
        headerTitle="All Users"
        columns={columns}
        dataSource={USERS}
        rowKey="id"
        rowSelection={{
          onChange: (keys) => setSelected(keys),
        }}
        bulkActions={[
          {
            label: `Activate (${selected.length})`,
            onClick: () => toast.success(`Activated ${selected.length} users`),
          },
          {
            label: `Delete (${selected.length})`,
            danger: true,
            onClick: () => toast.error(`Deleted ${selected.length} users`),
          },
        ]}
      />
    </div>
  )
}
