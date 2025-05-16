import * as React from 'react';
import { useState } from 'react';

interface FeedCardProps {
  avatarUrl?: string;
  username: string;
  timeAgo: string;
  category: string;
  postText: string;
  likes: number;
  comments: number;
  replies: number;
  tokenId?: number; // For future contract integration
}

const FeedCard: React.FC<FeedCardProps> = ({
  avatarUrl,
  username,
  timeAgo,
  category,
  postText,
  likes,
  comments,
  replies,
  tokenId,
}) => {
  const [likeCount, setLikeCount] = useState(likes);
  const [liked, setLiked] = useState(false);
  const [cheerCount, setCheerCount] = useState(0);
  const [cheered, setCheered] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentList, setCommentList] = useState<string[]>([]);

  function handleLike() {
    setLiked((v) => !v);
    setLikeCount((c) => c + (liked ? -1 : 1));
    // TODO: Replace with contract call to like(tokenId)
  }
  function handleCheer() {
    setCheered((v) => !v);
    setCheerCount((c) => c + (cheered ? -1 : 1));
    // TODO: Replace with contract call to cheer(tokenId)
  }
  function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText) return;
    setCommentList((list) => [...list, commentText]);
    setCommentText("");
    // TODO: Replace with contract call to comment(tokenId, commentText)
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 border border-gray-100 transition hover:shadow-lg">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img src={avatarUrl} alt={username} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200" />
        )}
        <div>
          <div className="font-semibold text-dark">{username}</div>
          <div className="text-xs text-light">{timeAgo}</div>
        </div>
      </div>
      <div className="mt-2 text-dark font-medium">{category}</div>
      <div className="text-light">{postText}</div>
      <div className="flex gap-6 mt-2 text-light text-sm">
        <button
          className={`flex items-center gap-1 transition ${liked ? 'text-primary' : 'hover:text-primary'}`}
          onClick={handleLike}
          aria-label="Like"
        >
          <span className="text-lg">{liked ? '❤️' : '♡'}</span> {likeCount}
        </button>
        <button
          className="flex items-center gap-1 hover:text-primary transition"
          aria-label="Comment"
          onClick={() => {}}
        >
          <span className="text-lg">💬</span> {commentList.length}
        </button>
        <button
          className={`flex items-center gap-1 transition ${cheered ? 'text-accent' : 'hover:text-accent'}`}
          onClick={handleCheer}
          aria-label="Cheer"
        >
          <span className="text-lg">🎉</span> {cheerCount}
        </button>
      </div>
      <form onSubmit={handleComment} className="flex gap-2 mt-2">
        <input
          className="flex-1 border rounded px-2 py-1 text-dark"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit" className="px-2 py-1 bg-primary text-white rounded">Send</button>
      </form>
      {commentList.length > 0 && (
        <div className="mt-2 text-xs text-dark">
          {commentList.map((c, i) => (
            <div key={i} className="mb-1">💬 {c}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedCard; 