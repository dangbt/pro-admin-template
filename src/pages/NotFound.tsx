import { useNavigate } from 'react-router-dom'
import { Empty, Button } from '@dangbt/pro-ui'
import { Home } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="text-8xl font-black text-primary/20 select-none">404</div>
        <Empty
          title="Page not found"
          description="The page you're looking for doesn't exist or has been moved."
        />
        <Button variant="primary" onPress={() => navigate('/dashboard')}>
          <Home className="w-4 h-4" />
          Back to dashboard
        </Button>
      </div>
    </div>
  )
}
