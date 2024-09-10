mod models;
use log::{debug, error};
const LOG_TARGET: &str = "tari::universe::clythor::http_api";

pub struct ClythorHttpApiClient {
    url: String,
    access_token: String,
}

impl ClythorHttpApiClient {
    pub fn new(url: String, access_token: String) -> Self {
        Self { url, access_token }
    }

    async fn get(&self, path: &str) -> Result<reqwest::Response, reqwest::Error> {
        let url = format!("{}/{}", self.url, path);
        reqwest::Client::new()
            .get(&url)
            .header("Authorization", format!("Bearer {}", self.access_token))
            .send()
            .await
    }

    pub async fn summary(&self) -> Result<models::Summary, anyhow::Error> {
        for _i in 0..3 {
            let response = self.get("2/summary").await?;

            let summary = response.text().await?;
            let summary: models::Summary = match serde_json::from_str(&summary) {
                Ok(summary) => summary,
                Err(e) => {
                    debug!(target: LOG_TARGET, "summary: {:?}", summary);
                    error!(target: LOG_TARGET, "Failed to parse clythor summary: {}", e);
                    continue;
                }
            };

            return Ok(summary);
        }
        Err(anyhow::anyhow!("Failed to get clythor summary"))
    }
}
