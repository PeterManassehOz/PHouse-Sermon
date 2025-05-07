import { useState } from "react";
import { useGetAllSubscribersQuery } from "../../redux/newsletterAuthApi/newsletterAuthApi";
import "./Subscribers.css";

const Subscribers = () => {
  const { data, isLoading, isError, error } = useGetAllSubscribersQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubscribers = data?.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading)
    return <p className="status">Loading subscribers...</p>;

  if (isError)
    return (
      <p className="status error">
        Error fetching subscribers: {error?.message || "Unknown error"}
      </p>
    );

  return (
    <div className="subscribers-container">
      <h2 className="subscribers-title">All Newsletter Subscribers</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by email..."
          className="subscriber-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="subscriber-list-wrapper">
        <ul className="subscriber-list">
          {filteredSubscribers?.length > 0 ? (
            [...filteredSubscribers].reverse().map((subscriber, index) => (
              <li key={index} className="subscriber-item">
                <p className="subscriber-email">
                  <strong>Email:</strong> {subscriber.email}
                </p>
                <p className="subscriber-date">
                  <strong>Subscribed At:</strong>{" "}
                  {new Date(subscriber.subscribedAt).toLocaleString()}
                </p>
              </li>
            ))
          ) : (
            <p className="status">No subscribers found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Subscribers;
