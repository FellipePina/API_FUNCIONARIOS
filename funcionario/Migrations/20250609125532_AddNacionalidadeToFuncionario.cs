using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace funcionario.Migrations
{
    /// <inheritdoc />
    public partial class AddNacionalidadeToFuncionario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Nacionalidade",
                table: "Funcionarios",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Nacionalidade",
                table: "Funcionarios");
        }
    }
}
