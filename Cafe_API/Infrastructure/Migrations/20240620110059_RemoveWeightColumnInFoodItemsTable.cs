using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cafe_API.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveWeightColumnInFoodItemsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Weight",
                table: "FoodItems");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<short>(
                name: "Weight",
                table: "FoodItems",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);
        }
    }
}
