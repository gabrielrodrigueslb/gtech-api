import {
  createOpportunity,
  getOpportunitiesByPipeline,
  updateOpportunity,
  deleteOpportunity,
} from '../services/opportunityService.js';

export async function createOpportunityController(req, res) {
  try {
    const data = req.body;
    
    // LÓGICA DE DONO:
    // Se o front não mandou quem é o dono, assume que é o usuário logado
    // (req.user vem do seu authMiddleware)
    if (!data.ownerId && req.user?.id) {
        data.ownerId = req.user.id;
    }

    const opportunity = await createOpportunity(data);
    
    return res.status(201).json(opportunity);
  } catch (error) {
    console.error("Erro ao criar oportunidade:", error);
    return res.status(400).json({ error: error.message });
  }
}

export async function getByPipelineController(req, res) {
  try {
    // Pode vir como /api/opportunities?pipelineId=... ou /pipeline/:pipelineId
    // Vamos suportar ambos para garantir
    const { pipelineId } = req.params.pipelineId ? req.params : req.query;

    if (!pipelineId) {
        return res.status(400).json({ error: "Pipeline ID é obrigatório" });
    }

    const opportunities = await getOpportunitiesByPipeline(pipelineId);
    
    return res.status(200).json(opportunities);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function updateOpportunityController(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!id) return res.status(400).json({ error: "ID é obrigatório" });

    const updated = await updateOpportunity(id, data);
    
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function deleteOpportunityController(req, res) {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: "ID é obrigatório" });

    await deleteOpportunity(id);
    
    return res.status(204).send(); // 204 No Content (padrão para delete)
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}