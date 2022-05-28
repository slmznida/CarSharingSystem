from flask import Flask, request, render_template
import json
from werkzeug.datastructures import ImmutableMultiDict


class WebServer:
    """
        class for describing simple HTTP server objects
    """

    def __init__(self):
        """
            Initialize flask object and a python dictionary
        """
        self.app = Flask(__name__)
        self.host = 'localhost'
        self.url = 'https://localhost:5000'
        self.users = []

    def requests(self):
        @self.app.route('/', methods=['GET'])
        def redirection():
            return render_template('anasayfa.html')

        @self.app.route('/araç bul', methods=['GET', 'POST'])
        def sign_up():
            if request.method == 'POST':
                self.users.append(request.form.to_dict(flat=False))
                return render_template('redirect_to_home.html')

            return render_template('araç bul.html')

        @self.app.route('/giriş', methods=['GET', 'POST'])
        def sign_in():
            if request.method == 'POST':
                for x in self.users:
                    if x['username'][0] == request.form['username']:
                        if x["password"][0] == request.form['password']:
                            return render_template('giriş.html')

                return 'Kullanıcı girişi başarısız!'
            return render_template('giriş.html')

        @self.app.route('/araba1', methods=['GET', 'POST'])
        def rent_car1():
            return render_template('araba1.html')

        @self.app.route('/araba2', methods=['GET', 'POST'])
        def rent_car2():
            return render_template('araba2.html')

        @self.app.route('/araba3', methods=['GET', 'POST'])
        def rent_car3():
            return render_template('araba3.html')

        @self.app.route('/kiralama', methods=['GET', 'POST'])
        def rent():
            return render_template('kiralama.html')

        @self.app.route('/harita', methods=['GET'])
        def show_map():
            return render_template('harita.html')

        @self.app.route('/terminate', methods=['GET', 'POST'])
        def terminate_rental():
            if request.method == 'GET':
                return "Araç Kiralama Sonlandırma"


if __name__ == "__main__":
    ws = WebServer()
    ws.requests()
    ws.app.run(debug=True, host=ws.host)