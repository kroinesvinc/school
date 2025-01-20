import os
import http.server
import socketserver
import webbrowser

PORT = 8080
DIRECTORY = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)


with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    webbrowser.open('localhost:8000', new=2)
    httpd.serve_forever()
