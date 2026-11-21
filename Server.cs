using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Reflection;
using System.Runtime.InteropServices;

[assembly: AssemblyTitle("SkillProof Enterprise Server")]
[assembly: AssemblyDescription("High-performance zero-dependency web server for SkillProof")]
[assembly: AssemblyConfiguration("")]
[assembly: AssemblyCompany("SkillProof Technologies")]
[assembly: AssemblyProduct("SkillProof Server")]
[assembly: AssemblyCopyright("Copyright © 2026 SkillProof")]
[assembly: AssemblyTrademark("")]
[assembly: AssemblyCulture("")]
[assembly: ComVisible(false)]
[assembly: AssemblyVersion("1.0.0.0")]
[assembly: AssemblyFileVersion("1.0.0.0")]

namespace SkillProof
{
    public class SkillProofServer
    {
        private const int Port = 5000;
        private static string WebRoot = "";

        public static void Main(string[] args)
        {
            Console.Title = "SkillProof Enterprise Web Server";
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("==================================================================");
            Console.WriteLine("     SKILLPROOF - High-Performance Enterprise Verification Server ");
            Console.WriteLine("     \"Don't Just Claim Your Skills. Prove Them.\"                  ");
            Console.WriteLine("==================================================================");
            Console.ResetColor();

            string currentDir = AppDomain.CurrentDomain.BaseDirectory;
            if (Directory.Exists(Path.Combine(currentDir, "app")))
            {
                WebRoot = Path.Combine(currentDir, "app");
            }
            else if (Directory.Exists(Path.GetFullPath("app")))
            {
                WebRoot = Path.GetFullPath("app");
            }
            else
            {
                WebRoot = currentDir;
            }

            Console.WriteLine("[INFO] Web Application Directory: " + WebRoot);

            TcpListener listener = null;
            try
            {
                listener = new TcpListener(IPAddress.Loopback, Port);
                listener.Start();
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine(string.Format("[ONLINE] SkillProof Server running at http://localhost:{0}/", Port));
                Console.WriteLine("[ONLINE] High-performance TcpListener active. Press Ctrl+C to stop.");
                Console.ResetColor();
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("[ERROR] Failed to start TcpListener: " + ex.Message);
                Console.ResetColor();
                return;
            }

            while (true)
            {
                try
                {
                    TcpClient client = listener.AcceptTcpClient();
                    ThreadPool.QueueUserWorkItem(ProcessClient, client);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("[WARN] Accept exception: " + ex.Message);
                }
            }
        }

        private static void ProcessClient(object state)
        {
            TcpClient client = (TcpClient)state;
            try
            {
                client.ReceiveTimeout = 5000;
                client.SendTimeout = 5000;
                using (NetworkStream stream = client.GetStream())
                {
                    StreamReader reader = new StreamReader(stream, Encoding.UTF8);
                    string requestLine = reader.ReadLine();
                    if (string.IsNullOrEmpty(requestLine)) return;

                    string[] parts = requestLine.Split(' ');
                    if (parts.Length < 2) return;

                    string method = parts[0];
                    string rawUrl = parts[1];

                    // Strip query parameters for local file path resolution
                    string urlPath = rawUrl;
                    int qIdx = urlPath.IndexOf('?');
                    if (qIdx >= 0) urlPath = urlPath.Substring(0, qIdx);
                    int hashIdx = urlPath.IndexOf('#');
                    if (hashIdx >= 0) urlPath = urlPath.Substring(0, hashIdx);

                    if (string.IsNullOrEmpty(urlPath) || urlPath == "/")
                    {
                        urlPath = "/index.html";
                    }

                    string relativePath = urlPath.TrimStart('/', '\\').Replace('/', Path.DirectorySeparatorChar);
                    string targetFile = Path.Combine(WebRoot, relativePath);

                    if (Directory.Exists(targetFile))
                    {
                        targetFile = Path.Combine(targetFile, "index.html");
                    }
                    else if (!File.Exists(targetFile) && File.Exists(targetFile + ".html"))
                    {
                        targetFile = targetFile + ".html";
                    }

                    if (File.Exists(targetFile))
                    {
                        byte[] fileBytes = File.ReadAllBytes(targetFile);
                        string mime = GetMimeType(Path.GetExtension(targetFile));

                        StringBuilder header = new StringBuilder();
                        header.Append("HTTP/1.1 200 OK\r\n");
                        header.Append("Content-Type: " + mime + "\r\n");
                        header.Append("Content-Length: " + fileBytes.Length + "\r\n");
                        header.Append("Access-Control-Allow-Origin: *\r\n");
                        header.Append("Cache-Control: no-cache, no-store, must-revalidate\r\n");
                        header.Append("Connection: close\r\n\r\n");

                        byte[] headerBytes = Encoding.UTF8.GetBytes(header.ToString());
                        stream.Write(headerBytes, 0, headerBytes.Length);
                        stream.Write(fileBytes, 0, fileBytes.Length);
                        stream.Flush();
                    }
                    else
                    {
                        string notFoundHtml = "<html><head><title>404 Not Found</title></head><body style='font-family:sans-serif;text-align:center;padding:50px;'><h2>404 - SkillProof Resource Not Found</h2><p>Cannot find: " + WebUtility.HtmlEncode(rawUrl) + "</p><a href='/'>Return to SkillProof Home</a></body></html>";
                        byte[] notFoundBytes = Encoding.UTF8.GetBytes(notFoundHtml);

                        StringBuilder header = new StringBuilder();
                        header.Append("HTTP/1.1 404 Not Found\r\n");
                        header.Append("Content-Type: text/html; charset=utf-8\r\n");
                        header.Append("Content-Length: " + notFoundBytes.Length + "\r\n");
                        header.Append("Connection: close\r\n\r\n");

                        byte[] headerBytes = Encoding.UTF8.GetBytes(header.ToString());
                        stream.Write(headerBytes, 0, headerBytes.Length);
                        stream.Write(notFoundBytes, 0, notFoundBytes.Length);
                        stream.Flush();
                    }
                }
            }
            catch { }
            finally
            {
                try { client.Close(); } catch { }
            }
        }

        private static string GetMimeType(string ext)
        {
            if (string.IsNullOrEmpty(ext)) return "application/octet-stream";
            switch (ext.ToLowerInvariant())
            {
                case ".html":
                case ".htm":
                    return "text/html; charset=utf-8";
                case ".js":
                    return "application/javascript; charset=utf-8";
                case ".json":
                    return "application/json; charset=utf-8";
                case ".css":
                    return "text/css; charset=utf-8";
                case ".svg":
                    return "image/svg+xml";
                case ".png":
                    return "image/png";
                case ".jpg":
                case ".jpeg":
                    return "image/jpeg";
                case ".gif":
                    return "image/gif";
                case ".ico":
                    return "image/x-icon";
                case ".woff":
                    return "font/woff";
                case ".woff2":
                    return "font/woff2";
                case ".ttf":
                    return "font/ttf";
                case ".txt":
                    return "text/plain; charset=utf-8";
                default:
                    return "application/octet-stream";
            }
        }
    }
}
