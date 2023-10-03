import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

function PostCard({post: {body, createdAt, id, username, likeCount, commentCount, likes }}) {

    function likePost() {
        console.log("Like post");
    }

    function commentPost() {
        console.log("Comment post");
    }

    return (
        <Link to={`/posts/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card mb-4">
                <img src="https://react.semantic-ui.com/images/avatar/large/molly.png" className="card-img-top img-fluid"
                style={{ maxHeight: '400px', margin: 'auto' }} 
                alt="User" />
                <div className="card-body">
                    <h2 className="card-title">{username}</h2>
                    <h6 className="card-text">{body}</h6>
                    <p className="card-text">
                        <small className="text-muted">{moment(createdAt).fromNow()}</small>
                    </p>
                </div>
                <div className="card-footer">
                    <button className="btn btn-primary mr-2" onClick={likePost}> 
                        <i className="bi bi-heart"></i> {likeCount} Likes
                    </button>
                    <button className="btn btn-secondary" style={{ marginLeft: '15px'}} onClick={commentPost}>  
                        <i className="bi bi-chat-square"></i> {commentCount} Comments
                    </button>
                </div>
            </div>
        </Link>
    );
}

export default PostCard;
