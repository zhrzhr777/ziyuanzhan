module.exports = {
  apps: [
    {
      name: "ziyuanzhan",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/home/你的用户名/ziyuanzhan",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      max_memory_restart: "500M",
      autorestart: true,
      watch: false,
    },
  ],
};
