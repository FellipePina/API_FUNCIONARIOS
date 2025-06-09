using Microsoft.EntityFrameworkCore; // Necessário para usar o FindAsync e o SaveChangesAsync
using FUNCIONARIO.Models;          // Para acessar sua classe Funcionario

namespace FUNCIONARIO.Rotas
{
    public static class Rota_PUT // Define uma classe estática para organizar suas rotas PUT
    {
        public static void MapPutRoutes(this WebApplication app) // Método de extensão para adicionar rotas PUT ao WebApplication
        {
            // Define o endpoint HTTP PUT para /api/funcionarios/{id}
            app.MapPut("/api/funcionarios/{id}", async (int id, Funcionario funcionarioAtualizado, FuncionarioContext context) =>
            {
                // 1. Encontrar o funcionário existente no banco de dados pelo ID fornecido na URL
                // O FindAsync é ideal para buscar pela chave primária (Id) de forma assíncrona.
                var funcionarioExistente = await context.Funcionarios.FindAsync(id);

                // 2. Verificar se o funcionário com o ID especificado foi encontrado
                // Se não for encontrado, significa que não há o que atualizar.
                if (funcionarioExistente is null)
                {
                    // Retorna um status HTTP 404 Not Found, indicando que o recurso não existe.
                    return Results.NotFound();
                }

                // 3. Atualizar as propriedades do funcionário existente com os novos dados recebidos
                // É crucial copiar cada propriedade individualmente para garantir que apenas os campos desejados
                // sejam alterados e para evitar problemas de "overposting" (onde campos não esperados são atualizados).
                funcionarioExistente.Nome = funcionarioAtualizado.Nome;
                funcionarioExistente.Idade = funcionarioAtualizado.Idade;
                funcionarioExistente.Sexo = funcionarioAtualizado.Sexo;
                funcionarioExistente.Cpf = funcionarioAtualizado.Cpf;
                funcionarioExistente.Email = funcionarioAtualizado.Email;
                funcionarioExistente.Celular = funcionarioAtualizado.Celular;
                funcionarioExistente.Cargo = funcionarioAtualizado.Cargo;
                funcionarioExistente.Setor = funcionarioAtualizado.Setor;
                funcionarioExistente.CargaHorariaSemanal = funcionarioAtualizado.CargaHorariaSemanal;
                funcionarioExistente.Salario = funcionarioAtualizado.Salario;
                funcionarioExistente.EstadoCivil = funcionarioAtualizado.EstadoCivil;
                funcionarioExistente.GastosPorMes = funcionarioAtualizado.GastosPorMes;

                // 4. Salvar as alterações no banco de dados
                // O Entity Framework Core rastreia as mudanças feitas em 'funcionarioExistente'
                // e gera a instrução SQL de UPDATE apropriada ao chamar SaveChangesAsync().
                await context.SaveChangesAsync();

                // 5. Retornar uma resposta de sucesso
                // Retorna um status HTTP 200 OK e o objeto 'funcionarioExistente' com os dados já atualizados.
                // Isso permite que o cliente veja o estado atualizado do recurso.
                return Results.Ok(funcionarioExistente);
            });
        }
    }
}