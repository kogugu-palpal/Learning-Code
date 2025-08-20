from kivy.app import App

class GreetingApp(App):

    def clear(self, widget_to_clear):
        widget_to_clear.text =''

    def hello(self, widget_to_greet):
        widget_to_greet.text = "Hello, How are you"

        
    # pass

if __name__ == '__main__':
    GreetingApp().run()