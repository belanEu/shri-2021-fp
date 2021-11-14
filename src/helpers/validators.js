/**
 * @file Домашка по FP ч. 1
 * 
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import {allPass, complement, compose, curry, equals, filter, length, partial, prop, uniq, isEmpty} from 'ramda';
import {COLORS as c} from './../constants';

const colorOf = (color, figure) => figure === color;
const curriedColorOf = curry(colorOf);
const isWhite = curriedColorOf(c.WHITE);
const isNotWhite = complement(isWhite);
const isRed = curriedColorOf(c.RED);
const isNotRed = complement(isRed);
const isGreen = curriedColorOf(c.GREEN);
const isBlue = curriedColorOf(c.BLUE);
const isOrange = curriedColorOf(c.ORANGE);

const figuresOfSameColor = (checkColor, figures) => filter(checkColor, figures);
const curriedFiguresOfSameColor = curry(figuresOfSameColor);
const greenFigures = curriedFiguresOfSameColor(isGreen);
const redFigures = curriedFiguresOfSameColor(isRed);
const blueFigures = curriedFiguresOfSameColor(isBlue);
const orangeFigures = curriedFiguresOfSameColor(isOrange);

const getStar = prop('star');
const getSquare = prop('square');
const getTriangle = prop('triangle');
const getCircle = prop('circle');

const starIsRed = compose(isRed, getStar);
const starIsNotRed = compose(isNotRed, getStar);
const starIsNotWhite = compose(isNotWhite, getStar);
const squareIsGreen = compose(isGreen, getSquare);
const squareIsOrange = compose(isOrange, getSquare);
const triangleIsGreen = compose(isGreen, getTriangle);
const triangleIsWhite = compose(isWhite, getTriangle);
const triangleIsNotWhite = compose(isNotWhite, getTriangle);
const circleIsWhite = compose(isWhite, getCircle);
const circleIsBlue = compose(isBlue, getCircle);

const valuesOfObject = figures => Object.values(figures);
const countAllFigures = compose(length, valuesOfObject);
const countFiguresOfSameColor = (fn, figures) => compose(length, fn, valuesOfObject)(figures);

const atLeast = (value, n) => n >= value;
const atLeastTwo = partial(atLeast, [2]);
const atLeastThree = partial(atLeast, [3]);
const equalsOne = partial(equals, [1]);
const equalsTwo = partial(equals, [2]);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (figures) => {
    const result = allPass([
        starIsRed,
        squareIsGreen,
        triangleIsWhite,
        circleIsWhite
    ]);
    return result(figures);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (figures) => {
    const result = compose(
        atLeastTwo,
        length,
        greenFigures,
        valuesOfObject
    );
    return result(figures);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (figures) => {
    const countRedFigures = compose(length, redFigures, valuesOfObject);
    const countBlueFigures = compose(length, blueFigures, valuesOfObject);
    return equals(
        countRedFigures(figures),
        countBlueFigures(figures)
    );
};

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = (figures) => {
    const result = allPass([
        circleIsBlue,
        starIsRed,
        squareIsOrange
    ]);
    return result(figures);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (figures) => {
    const getNonWhiteColors = compose(curriedFiguresOfSameColor(isNotWhite), uniq, valuesOfObject);
    const getFiguresOfColor = color => curriedFiguresOfSameColor(curriedColorOf(color));    
    const thereAreAtLeastThreeFiguresOfSameColor = color => compose(atLeastThree, length, getFiguresOfColor(color), valuesOfObject)(figures);

    return compose(
        complement(isEmpty),
        filter(thereAreAtLeastThreeFiguresOfSameColor),
        getNonWhiteColors
    )(figures);
};

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = (figures) => {
    const thereAreTwoGreenFigures = compose(equalsTwo, length, greenFigures, valuesOfObject);
    const thereIsOneRedFigure = compose(equalsOne, length, redFigures, valuesOfObject);
    return allPass([
        triangleIsGreen,
        thereAreTwoGreenFigures,
        thereIsOneRedFigure
    ])(figures);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (figures) => {
    const countOrangeFigures = partial(countFiguresOfSameColor, [orangeFigures]);
    return equals(countAllFigures(figures), countOrangeFigures(figures));
};

// 8. Не красная и не белая звезда.
export const validateFieldN8 = (figures) => {
    const starIsNotRedAndNotWhite = allPass([
        starIsNotRed,
        starIsNotWhite
    ]);
    return starIsNotRedAndNotWhite(figures);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (figures) => {
    const countGreenFigures = partial(countFiguresOfSameColor, [greenFigures]);
    return equals(countAllFigures(figures), countGreenFigures(figures));
};

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = (figures) => {
    const triangleAndSquareAreOfSameColor = figures => equals(getTriangle(figures), getSquare(figures));
    return allPass([
        triangleAndSquareAreOfSameColor,
        triangleIsNotWhite
    ])(figures);
};
