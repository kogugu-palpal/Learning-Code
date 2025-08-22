from kivy.app import App

class GreetingApp(App):

    def clear(self, widget_to_clear):
        widget_to_clear.text =''

    def hello(self, name_input_widget, hello_label_widget):
        name_to_greet = name_input_widget.text
        hello_label_widget.text = "Hello, How are you, "+ name_to_greet + "!"

        
    # pass

if __name__ == '__main__':
    GreetingApp().run()