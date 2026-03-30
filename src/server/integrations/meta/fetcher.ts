export async function fetchMetaAdsMetrics(
  adAccountId: string,
  accessToken: string,
  startDate: string,
  endDate: string
) {
  const url = `https://graph.facebook.com/v19.0/${adAccountId}/insights`;
  const params = new URLSearchParams({
    access_token: accessToken,
    level: "campaign",
    fields: "campaign_id,campaign_name,spend,impressions,clicks,actions,action_values",
    time_range: JSON.stringify({ since: startDate, until: endDate }),
    time_increment: "1", 
    limit: "500",
  });

  const res = await fetch(`${url}?${params.toString()}`);
  const data = await res.json();
  
  if (data.error) throw new Error(data.error.message);
  
  return data.data; 
}
