import axios from "axios";

type Post = {
  id: number;
  title: string;
  body: string;
};

type Comment = {
  id: number;
  name: string;
  email: string;
  body: string;
  postId: number;
};

export default async function PostsWithCommentsPage() {
  // เลือก Post IDs ที่อยากแสดง
  const postIds = [1, 8, 10, 79];

  // ดึงข้อมูล Post
  const postsReq = postIds.map((id) =>
    axios.get<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`)
  );
  const postsRes = await Promise.all(postsReq);
  const posts = postsRes.map((r) => r.data);

  // ดึงข้อมูล Comments
  const commentsReq = postIds.map((id) =>
    axios.get<Comment[]>(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
  );
  const commentsRes = await Promise.all(commentsReq);
  const commentsByPost = commentsRes.map((r, i) => ({
    post: posts[i],
    comments: r.data,
  }));

  return (
    <div className="space-y-10 p-6 bg-amber-50">
      <h1 className="text-2xl font-bold">Posts & Comments</h1>

      {commentsByPost.map(({ post, comments }) => (
        <div key={post.id} className="border p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">
             Post ID: {post.id} - {post.title}
          </h2>
          <p className="text-gray-700 mb-4">{post.body}</p>

          <h3 className="font-semibold"> Comments:</h3>
          <ul className="list-disc pl-6">
            {comments.map((c) => (
              <li key={c.id} className="mb-3">
                <p><strong>{c.name}</strong> ({c.email})</p>
                <p className="text-gray-700">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
