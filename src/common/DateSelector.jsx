import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { h0 } from '../utils';
import Header from './Header.jsx';
import classnames from 'classnames';
import './DateSelector.css';

const Day = memo((props) => {
    const { day, onSelect } = props;
    if (!day) return <td className="null"></td>;
    const classes = [];
    const now = h0();
    if (day < now) {
        classes.push('disabled');
    }

    if ([6, 0].includes(new Date(day).getDay())) {
        classes.push('weekend');
    }

    const dateString = now === day ? '今天' : new Date(day).getDate();

    return (
        <td className={classnames(classes)} onClick={() => onSelect(day)}>
            {dateString}
        </td>
    );
});

Day.propTypes = {
    day: PropTypes.number,
    onSelect: PropTypes.func.isRequired,
};

const Week = memo((props) => {
    const { days, onSelect } = props;
    return (
        <tr className="date-table-days">
            {days.map((day, index) => (
                <Day key={index} day={day} onSelect={onSelect} />
            ))}
        </tr>
    );
});

Week.propsType = {
    onSelect: PropTypes.func.isRequired,
    days: PropTypes.array.isRequired,
};

const Month = memo((props) => {
    const { onSelect, startingTimeInMonth } = props;

    const startDay = new Date(startingTimeInMonth);
    const currentDay = new Date(startingTimeInMonth);

    let days = [];

    while (currentDay.getMonth() === startDay.getMonth()) {
        days.push(currentDay.getTime());
        currentDay.setDate(currentDay.getDate() + 1);
    }

    //  向前补齐
    days = new Array(startDay.getDay() ? startDay.getDay() - 1 : 6)
        .fill(null)
        .concat(days);

    // 向后补齐
    const lastDay = new Date(days[days.length - 1]);
    days = days.concat(
        new Array(lastDay.getDay() ? 7 - lastDay.getDay() : 0).fill(null)
    );

    const weeks = [];

    for (let row = 0; row < days.length / 7; ++row) {
        const week = days.slice(row * 7, (row + 1) * 7);
        weeks.push(week);
    }

    return (
        <table className="date-table">
            <thead>
                <tr>
                    <td colSpan="7">
                        {startDay.getFullYear()} 年 {startDay.getMonth() + 1}
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr className="date-table-weeks">
                    <th>周一</th>
                    <th>周二</th>
                    <th>周三</th>
                    <th>周四</th>
                    <th>周五</th>
                    <th classnames="weekend">周六</th>
                    <th classnames="weekend">周日</th>
                </tr>
                {weeks.map((week, index) => (
                    <Week key={index} days={week} onSelect={onSelect} />
                ))}
            </tbody>
        </table>
    );
});

Month.propTypes = {
    onSelect: PropTypes.func.isRequired,
    startingTimeInMonth: PropTypes.number.isRequired,
};

export default function DateSelector(props) {
    const { show, onSelect, onBack } = props;

    const now = new Date(h0());
    now.setDate(1);

    const monthSequence = [now.getTime()];
    now.setMonth(now.getMonth() + 1);
    monthSequence.push(now.getTime());

    now.setMonth(now.getMonth() + 1);
    monthSequence.push(now.getTime());

    return (
        <div className={classnames('date-selector', { hidden: !show })}>
            <Header title="日期选择" onBack={onBack}></Header>
            <div className="date-selector-tables">
                <div className="date-selector-tables">
                    {monthSequence.map((month) => (
                        <Month
                            key={month}
                            onSelect={onSelect}
                            startingTimeInMonth={month}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

DateSelector.propTypes = {
    show: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};
