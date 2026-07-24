import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Tag, Typography, Popconfirm, message } from 'antd'
import { DeleteOutlined, LogoutOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { useAuth } from '../context/AuthContext'

const { Title } = Typography

// 模拟数据
const INITIAL_DATA = [
  {
    id: '001',
    project: 'Road Project A',
    overtime: true,
    hours: 3.5,
    created_at: '2024-04-10 10:30',
  },
  {
    id: '002',
    project: 'Bridge Maintenance B',
    overtime: false,
    hours: 2,
    created_at: '2024-04-09 13:00',
  },
  {
    id: '003',
    project: 'Pipeline Fix C',
    overtime: true,
    hours: 4.5,
    created_at: '2024-04-08 08:00',
  },
  {
    id: '004',
    project: 'Bridge Maintenance B',
    overtime: true,
    hours: 3,
    created_at: '2024-04-07 16:45',
  },
  {
    id: '005',
    project: 'Tunnel Cleaning D',
    overtime: false,
    hours: 8.1,
    created_at: '2024-04-03 11:43',
  },
]

export default function Main() {
  const { role, logout } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(INITIAL_DATA)

  const isAdmin = role === 'admin'

  // 计算图表数据：按项目分组统计累计工时
  const chartData = useMemo(() => {
    const projectHours = {}
    data.forEach((item) => {
      projectHours[item.project] = (projectHours[item.project] || 0) + item.hours
    })
    return {
      projects: Object.keys(projectHours),
      hours: Object.values(projectHours),
    }
  }, [data])

  const handleDelete = (id) => {
    setData((prev) => prev.filter((item) => item.id !== id))
    message.success(`工单 ${id} 已删除`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    message.info('已退出登录')
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
    },
    {
      title: 'Overtime',
      dataIndex: 'overtime',
      key: 'overtime',
      width: 100,
      render: (overtime) =>
        overtime ? <Tag color="red">Yes</Tag> : <Tag color="green">No</Tag>,
    },
    {
      title: 'Hours',
      dataIndex: 'hours',
      key: 'hours',
      width: 100,
      sorter: (a, b) => a.hours - b.hours,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    // 仅管理员可见的操作列
    ...(isAdmin
      ? [
          {
            title: 'Action',
            key: 'action',
            width: 100,
            render: (_, record) => (
              <Popconfirm
                title="确认删除"
                description={`确定要删除工单 ${record.id} 吗？`}
                onConfirm={() => handleDelete(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="primary" danger icon={<DeleteOutlined />} size="small">
                  Delete
                </Button>
              </Popconfirm>
            ),
          },
        ]
      : []),
  ]

  // ECharts 配置
  const chartOption = {
    title: {
      text: 'Project Hours Distribution',
      left: 'center',
      textStyle: { fontSize: 18, fontWeight: 'bold' },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const p = params[0]
        return `${p.name}<br/>Hours: <b>${p.value.toFixed(1)}h</b>`
      },
    },
    xAxis: {
      type: 'category',
      data: chartData.projects,
      axisLabel: {
        rotate: 15,
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Hours',
    },
    series: [
      {
        type: 'bar',
        data: chartData.hours.map((h) => Math.round(h * 10) / 10),
        itemStyle: {
          color: '#667eea',
          borderRadius: [6, 6, 0, 0],
        },
        barMaxWidth: 60,
        label: {
          show: true,
          position: 'top',
          formatter: '{c}h',
        },
      },
    ],
    grid: {
      top: 60,
      bottom: 80,
      left: 60,
      right: 40,
    },
  }

  return (
    <div style={styles.container}>
      {/* 头部 */}
      <div style={styles.header}>
        <Title level={4} style={{ margin: 0, color: '#fff' }}>
          工单管理系统
        </Title>
        <div style={styles.headerRight}>
          <Tag color={isAdmin ? 'gold' : 'blue'} style={styles.roleTag}>
            {isAdmin ? '管理员' : '普通用户'}
          </Tag>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ color: '#fff' }}
          >
            退出登录
          </Button>
        </div>
      </div>

      {/* 内容区 */}
      <div style={styles.content}>
        {/* 表格 */}
        <div style={styles.tableSection}>
          <Title level={5}>工单列表</Title>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            bordered
            pagination={data.length > 5 ? { pageSize: 5 } : false}
            locale={{ emptyText: '暂无工单数据' }}
          />
        </div>

        {/* 图表 */}
        <div style={styles.chartSection}>
          <ReactECharts
            option={chartOption}
            style={{ height: 400 }}
            notMerge
            lazyUpdate
          />
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f0f2f5',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 32px',
    height: 64,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  roleTag: {
    fontSize: 13,
    padding: '2px 12px',
  },
  content: {
    padding: 24,
    maxWidth: 1100,
    margin: '0 auto',
  },
  tableSection: {
    background: '#fff',
    padding: 24,
    borderRadius: 8,
    marginBottom: 24,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  chartSection: {
    background: '#fff',
    padding: 24,
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
}
