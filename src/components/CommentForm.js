"use client";
import { useState } from "react";
import { supabase } from "../../../utils/supabaseClient";

export default function CommentForm({ articleId }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // TODO: get user_id from session
    const { error } = await supabase.from("comments").insert({
      article_id: articleId,
      user_id: null, // replace with actual user id
      content,
    });
    if (error) setError(error.message);
    else {
      setSuccess("Comment posted!");
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        style={{ width: "100%", minHeight: 60 }}
      />
      <button type="submit">Post Comment</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
}
