using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SchoolAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddEnrollmentsToClassLecture : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Topic",
                table: "ClassLectures",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "Schedule",
                table: "ClassLectures",
                newName: "Date");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "ClassLectures",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "ClassLectures");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "ClassLectures",
                newName: "Topic");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "ClassLectures",
                newName: "Schedule");
        }
    }
}
