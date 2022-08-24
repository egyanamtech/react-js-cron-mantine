import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
// import Button from 'antd/lib/button'

import { CronProps, PeriodType } from './types'
import Period from './fields/Period'
import MonthDays from './fields/MonthDays'
import Months from './fields/Months'
import Hours from './fields/Hours'
import Minutes from './fields/Minutes'
import WeekDays from './fields/WeekDays'
import { classNames, setError, usePrevious } from './utils'
import { DEFAULT_LOCALE_EN } from './locale'
import { setValuesFromCronString, getCronStringFromValues } from './converter'
import { Group } from '@mantine/core'
import { Button } from '@mantine/core'
import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { Switch, Text } from '@mantine/core'
export default function Cron(props: CronProps) {
  const {
    clearButton = true,
    clearButtonAction = 'fill-with-every',
    locale = DEFAULT_LOCALE_EN,
    value = '',
    setValue,
    displayError = true,
    onError,
    className,
    defaultPeriod = 'day',
    allowEmpty = 'for-default-value',
    humanizeLabels = true,
    humanizeValue = false,
    disabled = false,
    readOnly = false,
    leadingZero = false,
    shortcuts = [
      '@yearly',
      '@annually',
      '@monthly',
      '@weekly',
      '@daily',
      '@midnight',
      '@hourly',
    ],
    clockFormat,
    periodicityOnDoubleClick = true,
    mode = 'multiple',
    allowedDropdowns = [
      'period',
      'months',
      'month-days',
      'week-days',
      'hours',
      'minutes',
    ],
    allowedPeriods = [
      'year',
      'month',
      'week',
      'day',
      'hour',
      'minute',
      'reboot',
    ],
  } = props
  const internalValueRef = useRef<string>(value)
  const defaultPeriodRef = useRef<PeriodType>(defaultPeriod)
  const [period, setPeriod] = useState<PeriodType | undefined>()
  const [monthDays, setMonthDays] = useState<number[] | undefined>()
  const [months, setMonths] = useState<number[] | undefined>()
  const [weekDays, setWeekDays] = useState<number[] | undefined>()
  const [hours, setHours] = useState<number[] | undefined>()
  const [minutes, setMinutes] = useState<number[] | undefined>()
  const [utchours, utcsetHours] = useState<number[] | undefined>()
  const [utcminutes, utcsetMinutes] = useState<number[] | undefined>()
  const [error, setInternalError] = useState<boolean>(false)
  const [valueCleared, setValueCleared] = useState<boolean>(false)
  const previousValueCleared = usePrevious(valueCleared)
  const localeJSON = JSON.stringify(locale)
  const [checked, setChecked] = useState(false)
  useEffect(
    () => {
      setValuesFromCronString(
        value,
        setInternalError,
        onError,
        allowEmpty,
        internalValueRef,
        true,
        locale,
        shortcuts,
        setMinutes,
        setHours,
        setMonthDays,
        setMonths,
        setWeekDays,
        setPeriod
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(
    () => {
      if (value !== internalValueRef.current) {
        setValuesFromCronString(
          value,
          setInternalError,
          onError,
          allowEmpty,
          internalValueRef,
          false,
          locale,
          shortcuts,
          setMinutes,
          setHours,
          setMonthDays,
          setMonths,
          setWeekDays,
          setPeriod
        )
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, internalValueRef, localeJSON, allowEmpty, shortcuts]
  )

  useEffect(
    () => {
      // Only change the value if a user touched a field
      // and if the user didn't use the clear button
      if (
        (period || minutes || months || monthDays || weekDays || hours) &&
        !valueCleared &&
        !previousValueCleared
      ) {
        const selectedPeriod = period || defaultPeriodRef.current
        const cron = getCronStringFromValues(
          selectedPeriod,
          months,
          monthDays,
          weekDays,
          checked ? utchours : hours,
          checked ? utcminutes : minutes,
          humanizeValue
        )

        setValue(cron, { selectedPeriod })
        internalValueRef.current = cron

        onError && onError(undefined)
        setInternalError(false)
      } else if (valueCleared) {
        setValueCleared(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      period,
      monthDays,
      months,
      weekDays,
      checked ? utchours : hours,
      checked ? utcminutes : minutes,
      humanizeValue,
      valueCleared,
    ]
  )

  const handleClear = useCallback(
    () => {
      setMonthDays([])
      setMonths([])
      setWeekDays([])
      setHours([])
      setMinutes([])

      // When clearButtonAction is 'empty'
      let newValue = ''

      const newPeriod =
        period !== 'reboot' && period ? period : defaultPeriodRef.current

      if (newPeriod !== period) {
        setPeriod(newPeriod)
      }

      // When clearButtonAction is 'fill-with-every'
      if (clearButtonAction === 'fill-with-every') {
        const cron = getCronStringFromValues(
          newPeriod,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        )

        newValue = cron
      }

      setValue(newValue, { selectedPeriod: newPeriod })
      internalValueRef.current = newValue

      setValueCleared(true)

      if (allowEmpty === 'never' && clearButtonAction === 'empty') {
        setInternalError(true)
        setError(onError, locale)
      } else {
        onError && onError(undefined)
        setInternalError(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [period, setValue, onError, clearButtonAction]
  )
  const internalClassName = useMemo(
    () =>
      classNames({
        'react-js-cron': true,
        'react-js-cron-error': error && displayError,
        'react-js-cron-disabled': disabled,
        'react-js-cron-read-only': readOnly,
        [`${className}`]: !!className,
        [`${className}-error`]: error && displayError && !!className,
        [`${className}-disabled`]: disabled && !!className,
        [`${className}-read-only`]: readOnly && !!className,
      }),
    [className, error, displayError, disabled, readOnly]
  )

  // const { className: clearButtonClassNameProp, ...otherClearButtonProps } =
  //   clearButtonProps
  const clearButtonClassName = useMemo(
    () =>
      classNames({
        'react-js-cron-clear-button': true,
        [`${className}-clear-button`]: !!className,
        // [`${clearButtonClassNameProp}`]: !!clearButtonClassNameProp,
      }),
    [className]
  )

  // const otherClearButtonPropsJSON = JSON.stringify(otherClearButtonProps)
  const clearButtonNode = useMemo(
    () => {
      if (clearButton && !readOnly) {
        return (
          // <Button
          //   className={clearButtonClassName}
          //   danger
          //   type='primary'
          //   disabled={disabled}
          //   {...otherClearButtonProps}
          //   onClick={handleClear}
          // >
          //   {locale.clearButtonText || DEFAULT_LOCALE_EN.clearButtonText}
          // </Button>
          <Button ml={5} onClick={handleClear} color='red' size='xs'>
            Clear
          </Button>
        )
      }

      return null
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      clearButton,
      readOnly,
      localeJSON,
      clearButtonClassName,
      disabled,
      // otherClearButtonPropsJSON,
      handleClear,
    ]
  )

  const periodForRender = period || defaultPeriodRef.current
  dayjs.extend(RelativeTime)
  dayjs.extend(utc)
  dayjs.extend(tz)
  // console.log(dayjs.utc())
  const offSet = new Date().getTimezoneOffset()
  // Number(dayjs.utc(dayjs().hour(hours![0]).minute(minutes![0])).format('mm'))
  console.log(value)

  useEffect(() => {
    const hourarr: number[] = []
    const minutearr: number[] = []
    // console.log({ hours, minutes })
    if (hours && hours.length > 0) {
      const newh = hours?.map((h) => {
        if (minutes && minutes.length > 0) {
          minutes?.map((m) => {
            hourarr.includes(
              Number(dayjs.utc(dayjs().hour(h).minute(m)).format('HH'))
            )
              ? null
              : hourarr.push(
                  Number(dayjs.utc(dayjs().hour(h).minute(m)).format('HH'))
                )
            minutearr.includes(
              Number(dayjs.utc(dayjs().hour(h).minute(m)).format('mm'))
            )
              ? null
              : minutearr.push(
                  Number(dayjs.utc(dayjs().hour(h).minute(m)).format('mm'))
                )

            // return {
            //   h: Number(dayjs.utc(dayjs().hour(h).minute(m)).format('HH')),
            //   m: Number(dayjs.utc(dayjs().hour(h).minute(m)).format('mm')),
            // }
          })
        } else {
          if (Number(dayjs.utc(dayjs().hour(h).minute(0)).format('mm')) !== 0) {
            hourarr.includes(
              Number(dayjs.utc(dayjs().hour(h).minute(0)).format('HH'))
            )
              ? null
              : hourarr.push(
                  Number(dayjs.utc(dayjs().hour(h).minute(0)).format('HH'))
                )
            minutearr.includes(
              Number(dayjs.utc(dayjs().hour(h).minute(0)).format('mm'))
            )
              ? null
              : minutearr.push(
                  Number(dayjs.utc(dayjs().hour(h).minute(0)).format('mm'))
                )
          } else {
            hourarr.includes(
              Number(dayjs.utc(dayjs().hour(h).minute(0)).format('HH'))
            )
              ? null
              : hourarr.push(
                  Number(dayjs.utc(dayjs().hour(h).minute(0)).format('HH'))
                )
          }
        }
      })
    }
    utcsetHours(hourarr)
    utcsetMinutes(minutearr)
  }, [hours, minutes])
  return (
    <>
      <Switch
        label='Convert to UTC timezone'
        checked={checked}
        onChange={(event) => setChecked(event.currentTarget.checked)}
      />
      <div className={internalClassName}>
        {/* <Group> */}

        {allowedDropdowns.includes('period') && (
          <Period
            value={periodForRender}
            setValue={setPeriod}
            locale={locale}
            className={className}
            disabled={disabled}
            readOnly={readOnly}
            shortcuts={shortcuts}
            allowedPeriods={allowedPeriods}
          />
        )}
        {periodForRender === 'reboot' ? (
          clearButtonNode
        ) : (
          <>
            {periodForRender === 'year' &&
              allowedDropdowns.includes('months') && (
                <Months
                  value={months}
                  setValue={setMonths}
                  locale={locale}
                  className={className}
                  humanizeLabels={humanizeLabels}
                  disabled={disabled}
                  readOnly={readOnly}
                  period={periodForRender}
                  periodicityOnDoubleClick={periodicityOnDoubleClick}
                  mode={mode}
                />
              )}

            {(periodForRender === 'year' || periodForRender === 'month') &&
              allowedDropdowns.includes('month-days') && (
                <MonthDays
                  value={monthDays}
                  setValue={setMonthDays}
                  locale={locale}
                  className={className}
                  weekDays={weekDays}
                  disabled={disabled}
                  readOnly={readOnly}
                  leadingZero={leadingZero}
                  period={periodForRender}
                  periodicityOnDoubleClick={periodicityOnDoubleClick}
                  mode={mode}
                />
              )}

            {(periodForRender === 'year' ||
              periodForRender === 'month' ||
              periodForRender === 'week') &&
              allowedDropdowns.includes('week-days') && (
                <WeekDays
                  value={weekDays}
                  setValue={setWeekDays}
                  locale={locale}
                  className={className}
                  humanizeLabels={humanizeLabels}
                  monthDays={monthDays}
                  disabled={disabled}
                  readOnly={readOnly}
                  period={periodForRender}
                  periodicityOnDoubleClick={periodicityOnDoubleClick}
                  mode={mode}
                />
              )}

            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
              }}
            >
              {periodForRender !== 'minute' &&
                periodForRender !== 'hour' &&
                allowedDropdowns.includes('hours') && (
                  <Hours
                    value={hours}
                    setValue={setHours}
                    locale={locale}
                    className={className}
                    disabled={disabled}
                    readOnly={readOnly}
                    leadingZero={leadingZero}
                    clockFormat={clockFormat}
                    period={periodForRender}
                    periodicityOnDoubleClick={periodicityOnDoubleClick}
                    mode={mode}
                  />
                )}

              {periodForRender !== 'minute' &&
                allowedDropdowns.includes('minutes') && (
                  <Minutes
                    value={minutes}
                    setValue={setMinutes}
                    locale={locale}
                    period={periodForRender}
                    className={className}
                    disabled={disabled}
                    readOnly={readOnly}
                    leadingZero={leadingZero}
                    clockFormat={clockFormat}
                    periodicityOnDoubleClick={periodicityOnDoubleClick}
                    mode={mode}
                  />
                )}

              {clearButtonNode}
            </div>
          </>
        )}
        {/* </Group> */}
      </div>
      <Group>
        {' '}
        <Text>
          Final Output:{' '}
          <Text weight={700} component='span'>
            {value}
          </Text>
        </Text>
      </Group>
    </>
  )
}
