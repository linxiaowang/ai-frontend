import { Link } from 'react-router'
import { useBearStore } from '@/store'

export default function Home() {
  const { bears, increase } = useBearStore()
  return (
    <div>
      <h1 className="text-3xl font-bold underline px-0">
        Hello world!
      </h1>
      <button onClick={() => increase(1)}>Increase</button>
      <p>
        Bears:
        {bears}
      </p>
      <Link to="/about">About</Link>
    </div>
  )
}
