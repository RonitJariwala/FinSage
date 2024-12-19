import React from 'react';

const Settings = () => {
  return (
    <div className="main-content">
      <h1>Settings</h1>
      <p>Configure your chatbot preferences, notifications, and other settings here.</p>
      {/* Add form to update user preferences */}
      <form>
        <div>
          <label htmlFor="notifications">Enable Notifications:</label>
          <input type="checkbox" id="notifications" />
        </div>
        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
};

export default Settings;