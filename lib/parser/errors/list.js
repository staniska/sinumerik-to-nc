'use babel'

export const errors = {
    'RU': [
        'Jopa',    //0
        'Не найден оператор sinumerik',   // 1
        'Ошибка при разборе условия IF-GOTO',   //  2
        'Применен оператор ROUND',  // NC   3
        'Между условиями нераспознанный оператор', //  4
        'Ошибка при разборе условия IF-ELSE',     //    5
        'Не найден ENDIF',                        //   6
        'Центр окружности в относительных координатах пока не работает', //   7
        'Номера кромок D без T, не поддерживаются',         //8
        'Конечная точка или текущая позиция заданы выражением (R-переменной)',    //9
        'Ошибка в значении координаты', //10
        'Цель перехода GOTO не найдена', //11
        'Цели перехода GOTO дублируются', //12
        'Не найдена замена', //13
        'Вызов подпрограммы еще не поддерживается для NC', //14
        'Невозможно определить g-code type. Применен type A', //15
        'Неведомая ошибка при парсинге круговой интерполяции', //16
        'Длина метки более 6 символов', //17  NC only
    ],
    'EN': [
        'Parsing error' , //0
        'operator not found for Sinumerik',   // 1
        'parsing "IF - GOTO" condition error',   //  2
        '"TRUNC" can\'t be converted yet',  // NC   3
        'bool operator is not parsed', //  4
        'parsing "IF - ELSE" condition error',     //    5
        'ENDIF not found',                        //   6
        'the relative coordinates of the arc center cannot be parsed yet', //   7
        'Edge Numbers "D" without T are not supported',         //8
        'the calculated value of the actual position or end point cannot be parsed',    //9
        'Coordinate value error', //10
        'GOTO target mark not found', //11
        'duplicate GOTO target mark', //12
        'operator replacement not found', //13
        'Subroutine calls not supported', //14
        'FANUC G-code type cannot be read. Default "A"', //15
        'arc parsing error', //16
        'Target name length greater than 6 characters', //17 NC only
    ]
}
