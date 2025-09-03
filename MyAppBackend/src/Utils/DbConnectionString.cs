namespace MyApp.Utils;

public static class DbConnectionString
{
    public static string FromEnv()
    {
        var host = Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost";
        var port = Environment.GetEnvironmentVariable("DB_PORT") ?? "5432";
        var user = Environment.GetEnvironmentVariable("DB_USER") ?? "app";
        var pwd = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "app";
        var db = Environment.GetEnvironmentVariable("DB_NAME") ?? "appdb";

        // Typical Npgsql connection string
        return $"Host={host};Port={port};Username={user};Password={pwd};Database={db}";
    }
}
