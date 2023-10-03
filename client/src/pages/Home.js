import React from 'react'
import { useQuery, gql } from '@apollo/client'
import PostCard from '../components/PostCard';

export default function Home() {
  const { loading, data } = useQuery(FETCHPOSTS);

  let posts = [];

  if (data) {
    posts = data.getPosts;
  }

  return (
    <>
      <div className="container" style={{ width: '60%' }}>
        <h1 className="mb-4">Recent Posts</h1>
        {loading ? (
          <h1>Loading posts...</h1>
        ) : (
          posts && posts.map((post) => (
            <div key={post.id}>
              <PostCard post={post} />
            </div>
          ))
        )}
      </div>
    </>
  );
}

const FETCHPOSTS = gql`
query{
  getPosts{
    id
    body
    createdAt
    username
    likeCount
    likes{
      username
    }
    commentCount
    comments{
      id
      username
      createdAt
      body
    }
  }
}
`;
