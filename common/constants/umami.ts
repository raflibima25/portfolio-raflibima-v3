export const UMAMI_ACCOUNT = {
  username: "Rafli Bima Pratandra",
  api_key: process.env.UMAMI_API_KEY,
  base_url: "https://api.umami.is/v1/websites",
  endpoint: {
    page_views: "/pageviews",
    sessions: "/sessions/stats",
  },
  parameters: {
    startAt: 1717174800000, // 1 Juni 2024 00:00 WIB
    endAt: Date.now(),      // selalu sampai waktu sekarang (dinamis)
    unit: "month",
    timezone: "Asia/Jakarta",
  },
  is_active: true,
  websites: [
    {
      domain: "raflibima.my.id",
      website_id: process.env.UMAMI_WEBSITE_ID_MYID,
      umami_url: "",
    },
    {
      domain: "raflibima.site",
      website_id: process.env.UMAMI_WEBSITE_ID_SITE,
      umami_url: "",
    },
  ],
};

