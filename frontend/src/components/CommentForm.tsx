import { FC, FormEvent, useState } from 'react'

interface CommentFormProps {
  onComment: (content: string) => void
}

const CommentForm: FC<CommentFormProps> = ({ onComment }) => {
  const [content, setContent] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onComment(content)
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <input
        className="w-full p-2 border border-gray-600 bg-gray-700 text-black rounded-lg"
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="submit"
        className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Comment
      </button>
    </form>
  )
}

export default CommentForm
