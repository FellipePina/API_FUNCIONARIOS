using Microsoft.EntityFrameworkCore;
using FUNCIONARIO.Models;

namespace FUNCIONARIO.Rotas
{
    public static class Rota_GET
    {
        public static void MapGetRoutes(this WebApplication app)
        {
            app.MapGet("/api/funcionarios", async (
                FuncionarioContext context,
                int? id,
                string? cpf,
                string? cargo,
                string? setor
            ) =>
            {
                var query = context.Funcionarios.AsQueryable();

                if (id.HasValue)
                {
                    query = query.Where(f => f.Id == id.Value);
                }

                if (!string.IsNullOrWhiteSpace(cpf))
                {
                    // Mantém o Contains, mas aplica ToLower em ambos os lados
                    query = query.Where(f => f.Cpf.ToLower().Contains(cpf.ToLower()));
                }

                if (!string.IsNullOrWhiteSpace(cargo))
                {
                    // Aplica ToLower em ambos os lados para ignorar o case
                    query = query.Where(f => f.Cargo.ToLower().Contains(cargo.ToLower()));
                }

                if (!string.IsNullOrWhiteSpace(setor))
                {
                    // Aplica ToLower em ambos os lados para ignorar o case
                    query = query.Where(f => f.Setor.ToLower().Contains(setor.ToLower()));
                }
                
                var funcionarios = await query.ToListAsync();

                return Results.Ok(funcionarios);
            });

            // Mantemos a rota GET por ID específico inalterada
            app.MapGet("/api/funcionarios/{id:int}", async (int id, FuncionarioContext context) =>
            {
                var funcionario = await context.Funcionarios.FindAsync(id);
                return funcionario is not null ? Results.Ok(funcionario) : Results.NotFound();
            });
        }
    }
}