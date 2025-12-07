import {
  createPipeline,
  deletePipeline,
  getPipelines,
  updatePipeline,
} from '../services/pipelineServices.js';

export async function createPipelineController(req, res) {
  try {
    const { name } = req.body;
    const pipeline = await createPipeline(name);
    res.status(201).json(pipeline);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getPipelinesController(req, res) {
  try {
    const pipelines = await getPipelines();
    res.status(200).json(pipelines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deletePipelineController(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error('ID do pipeline é obrigatório');
    }

    const deletedPipeline = await deletePipeline(id);
    res.status(200).json(deletedPipeline);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function updatePipelineController(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id) {
      throw new Error('ID do pipeline é obrigatório');
    }

    if (!name) {
      throw new Error('Nome do pipeline é obrigatório');
    }

    const updatedPipeline = await updatePipeline(id, name);
    res.status(200).json(updatedPipeline);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
