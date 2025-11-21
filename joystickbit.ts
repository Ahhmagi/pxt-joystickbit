
/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */




//% weight=0 color=#0fbc11  icon="\uf11b" block="Joystickbit"
namespace joystickbit {

    let lastButtonState: { [key: number]: boolean } = {};
    let lastDebounceTime: { [key: number]: number } = {};
    const DEBOUNCE_DELAY = 50; // 消抖时间，单位 ms


    export enum JoystickBitPin {
        //% block="C"
        P12 = DAL.MICROBIT_ID_IO_P12,
        //% block="D"
        P13 = DAL.MICROBIT_ID_IO_P13,
        //% block="E"
        P14 = DAL.MICROBIT_ID_IO_P14,
        //% block="F"
        P15 = DAL.MICROBIT_ID_IO_P15
    }

    export enum rockerType {
        //% block="X"
        X,
        //% block="Y"
        Y
    }


    export enum ButtonType {
        //% block="pressed"
        down = PulseValue.High,
        //% block="released"
        up = PulseValue.Low
    }

    /**
    * initialization joystick:bit
    */
    //% blockId=initJoystickBit block="initialization joystick:bit"
    export function initJoystickBit(): void {
        pins.digitalWritePin(DigitalPin.P0, 0)
        pins.setPull(DigitalPin.P12, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P13, PinPullMode.PullUp)

        
        pins.setPull(DigitalPin.P14, PinPullMode.PullUp)
        pins.setPull(DigitalPin.P15, PinPullMode.PullUp)
        pins.digitalWritePin(DigitalPin.P16, 1)
    }

    /**
    * get Button
    */
    //% blockId=getButton block="button %button is pressed"
    export function getButton(button: JoystickBitPin): boolean {
        const pin = <number>button;
        const reading = pins.digitalReadPin(pin) === 0; // true if pressed

        const now = control.millis();

        // 初始化状态
        if (lastButtonState[pin] === undefined) {
            lastButtonState[pin] = reading;
            lastDebounceTime[pin] = now;
            return reading;
        }

        // 如果读数变化，重置消抖计时器
        if (reading !== lastButtonState[pin]) {
            lastDebounceTime[pin] = now;
        }

        // 如果稳定时间超过阈值，才更新状态
        if ((now - lastDebounceTime[pin]) > DEBOUNCE_DELAY) {
            // 可选：这里可以返回稳定后的状态
            // 但通常我们希望 getButton 返回当前“有效”状态
            // 所以直接返回 reading 是合理的（因为已经过了 debounce 时间）
        }

        // 更新最后状态
        lastButtonState[pin] = reading;

        // 返回去抖后的状态：只有当稳定后才认为是真实状态
        return (now - lastDebounceTime[pin]) > DEBOUNCE_DELAY ? reading : lastButtonState[pin];
    }



    /**
    * Registers code to run when a joystick:bit event is detected.
    */
    //% blockId=onButtonEvent block="on button %button|is %event" blockExternalInputs=false
    export function onButtonEvent(button: JoystickBitPin, event: ButtonType, handler: Action): void {
        pins.onPulsed(<number>button, <number>event, handler);
    }



    /**
    * Reads rocker value for the defined axis.
    * @param rocker rocker axis to read
    */
    //% blockId=getRockerValue block="rocker value of %rocker"
    export function getRockerValue(rocker: rockerType): number {
        switch (rocker) {
            case rockerType.X: return pins.analogReadPin(AnalogPin.P1);
            case rockerType.Y: return pins.analogReadPin(AnalogPin.P2);
            default: return 0;
        }
    }




    /**
    * vibration motor
    * @param time describe parameter here, eg: 100
    */
    //% blockId=Vibration_Motor block="motor vibrate for %time ms"
    export function Vibration_Motor(time: number): void {
        pins.digitalWritePin(DigitalPin.P16, 0)
        basic.pause(time)
        pins.digitalWritePin(DigitalPin.P16, 1)
    }










}

