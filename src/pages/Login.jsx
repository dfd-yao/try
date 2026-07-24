import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'

const { Title } = Typography

export default function Login() {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const onFinish = (values) => {
    setLoading(true)
    // 模拟登录延迟
    setTimeout(() => {
      const role = login(values.username)
      setLoading(false)
      message.success(`登录成功，当前权限：${role === 'admin' ? '管理员' : '普通用户'}`)
      navigate('/main')
    }, 500)
  }

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <Title level={3} style={styles.title}>
          工单管理系统
        </Title>
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登 录
            </Button>
          </Form.Item>
        </Form>
        <Typography.Text type="secondary" style={styles.hint}>
          提示：用户名为 "admin" 获得管理员权限，其他为普通用户
        </Typography.Text>
      </Card>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  card: {
    width: 400,
    borderRadius: 8,
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
  },
  hint: {
    display: 'block',
    textAlign: 'center',
    fontSize: 12,
  },
}
