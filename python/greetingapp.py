from kivy.app import App

class GreetingApp(App):

    def clear(self, widget_to_clear):
        widget_to_clear.text =''

    def hello(self, name_input_widget, hello_label_widget):
        # Get the text from the input box
        name_to_greet = name_input_widget.text
    
        # Check if the text is empty or the default placeholder
        if name_to_greet == "Please enter your name!" or name_to_greet == "":
            hello_label_widget.text = "Please enter your name!"

        else:
            # If it's not empty, show the greeting
            hello_label_widget.text = "Hello, How are you, " + name_to_greet + "!"

        
    # pass

if __name__ == '__main__':
    GreetingApp().run()