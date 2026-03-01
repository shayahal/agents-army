// src/api/routes.js
export function setupRoutes(app) {
  // POST /api/pipelines - Start new pipeline
  app.post('/api/pipelines', async (req, res) => {
    try {
      const { idea } = req.body;

      if (!idea || typeof idea !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid "idea" field' });
      }

      // TODO: Create job in queue and return jobId
      res.status(201).json({
        message: 'Pipeline queued',
        jobId: 'TODO',
        status: 'queued',
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/pipelines/:jobId - Get pipeline status
  app.get('/api/pipelines/:jobId', async (req, res) => {
    try {
      const { jobId } = req.params;

      // TODO: Get job from queue and return status
      res.json({
        jobId,
        status: 'unknown',
        message: 'TODO: implement status check',
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // PUT /api/pipelines/:jobId/answers - Submit user answers
  app.put('/api/pipelines/:jobId/answers', async (req, res) => {
    try {
      const { jobId } = req.params;
      const { answers } = req.body;

      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Invalid answers format' });
      }

      // TODO: Store answers and resume pipeline
      res.json({
        jobId,
        status: 'processing',
        message: 'Answers received, pipeline resuming',
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
