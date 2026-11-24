import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const timeAgo = (d) => {
  const h = Math.floor((Date.now() - new Date(d)) / 3600000);
  return h < 1 ? "just now" : h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
};

export default function Feed() {
  const [q, setQ] = useState("");
  const [last24, setLast24] = useState(false);
  const [usOnly, setUsOnly] = useState(false);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const search = async () => {
    try {
      const params = {};
      if (q) params.q = q;
      if (last24) params.hours = 24;
      if (usOnly) params.country = "US";
      const { data } = await api.get("/posts", { params });
      setPosts(data);
    } catch {
      navigate("/");
    }
  };

  const signOut = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) return navigate("/");
    search();
  }, []);

  return (
    <>
      <div className="navbar">
        <h1 className="logo">Mock LinkedIn</h1>
        <div className="nav-right">
          <span>Hi, {localStorage.getItem("name") || "User"}</span>
          <button className="signout" onClick={signOut}>Sign out</button>
        </div>
      </div>

      <div className="container">
        <div className="filter-card">
          <div className="search-row">
            <input id="search-input" className="input" placeholder="Search posts, e.g. Java C2C"
              value={q} onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()} />
            <button id="search-btn" className="btn" onClick={search}>Search</button>
          </div>
          <div className="chips">
            <label className="chip">
              <input id="filter-24h" type="checkbox" checked={last24}
                onChange={(e) => setLast24(e.target.checked)} /> Last 24 hours
            </label>
            <label className="chip">
              <input id="filter-us" type="checkbox" checked={usOnly}
                onChange={(e) => setUsOnly(e.target.checked)} /> US-based jobs
            </label>
          </div>
        </div>

        <h2 className="feed-title">Feed ({posts.length} posts)</h2>

        {posts.length === 0 && <p className="empty">No posts found</p>}

        {posts.map((p) => (
          <div key={p._id} className="post-card">
            <div className="avatar">{p.author.charAt(0)}</div>
            <div className="post-body">
              <b className="post-author">{p.author}</b>
              <div className="post-meta">
                <span className="post-location">{p.location}</span> · <span>{timeAgo(p.createdAt)}</span>
              </div>
              <p className="post-text">{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}