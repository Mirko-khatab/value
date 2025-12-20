module.exports = {
  apps: [
    {
      name: "valuearch-app",
      script: "server-wrapper.js",
      cwd: "/root/Documents/value",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        MYSQL_HOST: "127.0.0.1",
        MYSQL_USER: "valueapp",
        MYSQL_PASSWORD: "ValueApp2024Pass",
        MYSQL_DATABASE: "dashboard",
        AUTH_SECRET: "asdjfskjdfljspfasldjkfleeygc",
        AUTH_URL: "https://valuearch.com",
        AUTH_TRUST_HOST: "true",
        CLOUD_API_BASE_URL: "https://cloud.mirkokawa.dev/api",
        CLOUD_BUCKET_ID: "b843b188-87d6-4c8e-b2aa-eb2ebc65c362",
        CLOUD_API_KEY_FULL:
          "18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13",
        CLOUD_API_KEY_READ:
          "9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d",
      },
    },
  ],
};




