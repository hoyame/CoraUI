import { DrawText2 } from "../core/utils"

interface IButtons {
    name: string;
    onClick?: any;
}

interface ICMenu {
    name: string;
    glare: boolean;
    buttons: IButtons[]
}

export class CoraUI {
    static Config = {
        mode: 0, // dark: 0, white: 1

        colors: {
            dark: {
                header: [16, 16, 16, 255]
            },

            white: {
                header: [250, 242, 117, 255]
            }         
        },

        x: 0.140,
        y: 0.175,
        width: 0.225,
        
        bottomHeight: 0.029,
        headerHeight: 0.095,

        glare: true,

    }

    static Menu = {
        Opened: true,
        IndexButton: 0
    }

    static CurrentMenu: ICMenu = {
        name: '',
        glare: false,
        buttons: [],
    }

    constructor() {
  
    }

    public static drawHeader() {        
        let Glare = RequestScaleformMovie('MP_MENU_GLARE')

        if (this.Menu.Opened == true) {
            DrawRect(this.Config.x, this.Config.y, this.Config.width, this.Config.headerHeight, this.Config.colors.dark.header[0], this.Config.colors.dark.header[1], this.Config.colors.dark.header[2], this.Config.colors.dark.header[3])
            
            if (this.CurrentMenu.glare) {
                PushScaleformMovieFunction(Glare, "initScreenLayout")
                PopScaleformMovieFunctionVoid()
                DrawScaleformMovie(Glare, this.Config.x + 0.297, this.Config.y + 0.3985, this.Config.width + 0.7, this.Config.headerHeight + 0.953, 255, 255, 255, 255, 0)
            }
            
            DrawText2(this.CurrentMenu.name, this.Config.x - 0.095, this.Config.y - 0.024, 0.75, 1, [255, 255, 255, 255])
            DrawRect(this.Config.x, this.Config.y + (this.Config.headerHeight - 0.03065) , this.Config.width, this.Config.bottomHeight + 0.0030, this.Config.colors.dark.header[0], this.Config.colors.dark.header[1], this.Config.colors.dark.header[2], 230)
            DrawText2('Actions disponibles', this.Config.x - 0.1075, this.Config.y + (this.Config.headerHeight - 0.042), 0.265, 0, [255, 255, 255, 255])
            DrawText2((this.Menu.IndexButton + 1) + '/' + (this.CurrentMenu.buttons.length), this.Config.x + 0.093, this.Config.y + (this.Config.headerHeight - 0.041), 0.265, 0, [255, 255, 255, 255])
        }
    }

    public static drawButtons() {
 
        if (this.Menu.Opened == true) {

            for (let i = 0; i < this.CurrentMenu.buttons.length; i++) {
                let color = i == this.Menu.IndexButton ? [255, 255, 255, 255] : [16, 16, 16, 120] ; 
                let colorText = i == this.Menu.IndexButton ? [0, 0, 0, 255] : [255, 255, 255, 255]; 

                DrawRect(this.Config.x, this.Config.y + (this.Config.bottomHeight + 0.0055) + (this.Config.bottomHeight * (i + 1) + 0.033) , this.Config.width, this.Config.bottomHeight + 0.0011, color[0], color[1], color[2], color[3])
                DrawText2(this.CurrentMenu.buttons[i].name, this.Config.x - 0.1075, this.Config.y + (this.Config.bottomHeight * (i + 1) + 0.0565), 0.265, 0, [colorText[0], colorText[1], colorText[2], colorText[3]])
            }

        } 
    }

    public static controlMenu() {
        if (IsControlJustPressed(0, 27)) {
            console.log("up", this.Menu.IndexButton)

            if (this.Menu.IndexButton <= 0) {
                this.Menu.IndexButton = this.CurrentMenu.buttons.length - 1
            } else {
                this.Menu.IndexButton --
            }

        } else if (IsControlJustPressed(0, 173)) {
            console.log("down", this.Menu.IndexButton)

            if (this.Menu.IndexButton >= this.CurrentMenu.buttons.length -1 ) {
                this.Menu.IndexButton = 0
            } else {
                this.Menu.IndexButton ++
            }
        } else if (IsControlJustPressed(0, 201)) {
            this.CurrentMenu.buttons[this.Menu.IndexButton].onClick();
        }
    }

    public static drawMenu() {
        if (this.Menu.Opened) {
            this.drawHeader();
            this.drawButtons();
            this.controlMenu();
        }
    }
    
    public static openMenu(obj: ICMenu) {
        this.Menu.Opened = true;
        this.CurrentMenu = obj;
        console.log(this.Menu.IndexButton)

        this.drawMenu();
    }

    public static resetMenu() {
        this.Menu.IndexButton = 0
        this.CurrentMenu = {
            name: '',
            glare: false,
            buttons: [],
        }
    }

    public static closeMenu() {
        this.resetMenu()
        this.Menu.Opened = false
    }
}

setTick(() => {
    if (CoraUI.Menu.Opened) {
        CoraUI.drawMenu();
    }
})