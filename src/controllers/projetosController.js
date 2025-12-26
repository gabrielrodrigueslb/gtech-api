import { createProject, deleteProject, getAllProjects, getProjectById, updateProject } from '../services/projetosServices.js';

export async function createProjectController(req, res) {
  try {
    const data = req.body;

    const project = await createProject(data);
    return res.status(201).json(project);
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    return res.status(400).json({ error: error.message });
  }
}

export async function getAllProjectsController(req, res) {
  try {
    const projects = await getAllProjects();
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Erro no getAllProjectsController:', error); // Isso vai mostrar o erro no terminal do backend
    return res.status(500).json({ error: 'Erro ao buscar projetos.' });
  }
}
export async function getProjectByIdController(req, res) {
  try {
    const { id } = req.params;
    const project = await getProjectById(Number(id));
    
    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado.' });
    }

    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function updateProjectController(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedProject = await updateProject(Number(id), data);
    return res.status(200).json(updatedProject);
  } catch (error) {
    console.error(error);
    // Erro P2025 do Prisma significa "Record to update not found"
    if (error.code === 'P2025') {
       return res.status(404).json({ error: 'Projeto não encontrado para edição.' });
    }
    return res.status(400).json({ error: error.message });
  }
}

export async function deleteProjectController(req, res) {
  try {
    const { id } = req.params;
    await deleteProject(Number(id));
    
    return res.status(200).json({ message: 'Projeto excluído com sucesso.' });
  } catch (error) {
    if (error.code === 'P2025') {
       return res.status(404).json({ error: 'Projeto não encontrado para exclusão.' });
    }
    return res.status(400).json({ error: error.message });
  }
}
