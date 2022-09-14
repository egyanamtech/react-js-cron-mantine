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
import { Container, Group, SimpleGrid, TextInput } from '@mantine/core'
import { Button } from '@mantine/core'
import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { Switch, Text } from '@mantine/core'
export default function Cron(props: CronProps) {
  const {
    timezone_value = 'UTC',
    clearButton = true,
    convertToTimezone = false,
    clearButtonAction = 'fill-with-every',
    locale = DEFAULT_LOCALE_EN,
    value = '',
    setValue,
    setValueObj,
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
      'switch',
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
  const [tzhours, setTzHours] = useState<number[] | undefined>()
  const [tzminutes, setTzMinutes] = useState<number[] | undefined>()
  const [utchours, utcsetHours] = useState<number[] | undefined>()
  const [utcminutes, utcsetMinutes] = useState<number[] | undefined>()
  const [error, setInternalError] = useState<boolean>(false)
  const [tzerror, setTzError] = useState<string>('')

  const [valueCleared, setValueCleared] = useState<boolean>(false)
  const previousValueCleared = usePrevious(valueCleared)
  const localeJSON = JSON.stringify(locale)
  //checked boolean const is used for if convertToUTC or timezone_value present it gets true
  const [checked, setChecked] = useState(false)
  //The below code sets checked value true or false if convertToUTC or timezone_value changes
  // useEffect(() => {
  //   if (timezone_value !== '' || convertToUtc == true) {
  //     setChecked(true)
  //   } else {
  //     setChecked(false)
  //   }
  // }, [timezone_value, convertToUtc])
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
          convertToTimezone ? tzhours : hours,
          convertToTimezone ? tzminutes : minutes,
          setValueObj,
          humanizeValue
        )

        setValue(cron, { selectedPeriod })
        internalValueRef.current = cron

        // onError && onError(undefined)
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
      tzhours,
      tzminutes,
      minutes,
      hours,
      humanizeValue,
      timezone_value,
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
          undefined,
          setValueObj
        )

        newValue = cron
      }

      setValue(newValue, { selectedPeriod: newPeriod })
      internalValueRef.current = newValue

      setValueCleared(true)

      if (allowEmpty === 'never' && clearButtonAction === 'empty') {
        setInternalError(true)
        // setError(onError, locale)
      } else {
        // onError && onError(undefined)
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
          <Button
            disabled={disabled}
            ml={5}
            onClick={handleClear}
            color='red'
            size='xs'
          >
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
  useEffect(() => {
    const hourarr: number[] = []
    const minutearr: number[] = []
    //the below code handles timezone string value and converts to input timezone

    if (convertToTimezone == true) {
      try {
        /*Below code loops through hours and minutes  same hour or minutes is already present in
          hourarr variable then it skips that and if not then it converts to utc and pushes the values
        */
        if (hours && hours.length > 0) {
          const newh = hours?.map((h) => {
            if (minutes && minutes.length > 0) {
              minutes?.map((m) => {
                hourarr.includes(
                  Number(
                    dayjs().hour(h).minute(m).tz(timezone_value).format('HH')
                  )
                )
                  ? null
                  : hourarr.push(
                      Number(
                        dayjs()
                          .hour(h)
                          .minute(m)
                          .tz(timezone_value)

                          .format('HH')
                      )
                    )
                minutearr.includes(
                  Number(
                    dayjs().hour(h).minute(m).tz(timezone_value).format('mm')
                  )
                )
                  ? null
                  : minutearr.push(
                      Number(
                        dayjs()
                          .hour(h)
                          .minute(m)
                          .tz(timezone_value)

                          .format('mm')
                      )
                    )
              })
            }
            //if minutes values not present then below code executes
            //if hour timezone value has minutes then new hour and minutes pushed to the array
            else {
              if (
                Number(
                  dayjs().hour(h).minute(0).tz(timezone_value).format('mm')
                ) !== 0
              ) {
                hourarr.includes(
                  Number(
                    dayjs().hour(h).minute(0).tz(timezone_value).format('HH')
                  )
                )
                  ? null
                  : hourarr.push(
                      Number(
                        dayjs()
                          .hour(h)
                          .minute(0)
                          .tz(timezone_value)

                          .format('HH')
                      )
                    )
                minutearr.includes(
                  Number(
                    dayjs().hour(h).minute(0).tz(timezone_value).format('mm')
                  )
                )
                  ? null
                  : minutearr.push(
                      Number(
                        dayjs()
                          .hour(h)
                          .minute(0)
                          .tz(timezone_value)

                          .format('mm')
                      )
                    )
              }
              //if hour timezone value does not have minutes values then new hour value pushed through array
              else {
                hourarr.includes(
                  Number(
                    dayjs().hour(h).minute(0).tz(timezone_value).format('HH')
                  )
                )
                  ? null
                  : hourarr.push(
                      Number(
                        dayjs()
                          .hour(h)
                          .minute(0)
                          .tz(timezone_value)

                          .format('HH')
                      )
                    )
              }
            }
          })
        }

        //the below code sets timezoen hours and minutes and also clears error
        setTzHours(hourarr)
        setTzMinutes(minutearr)
        setInternalError(false)
        onError && onError(undefined)
        setTzError('')
      } catch (err) {
        setTzError(err.message)
        onError && onError({ type: 'invalid_cron', description: err.message })
        setInternalError(true)
        // onError && onError({ type: 'invalid_cron', description: err.message })

        // setError(onError, (locale.errorInvalidCron = err.message))
        // onError()
        // onError({type:"invalid_cron" ,description:err.message})
      }
    } else {
      setTzError('')
      setInternalError(false)
      onError && onError(undefined)
      setTzHours([])
      setTzMinutes([])
    }
  }, [hours, minutes, timezone_value, convertToTimezone])

  return (
    <>
      {/* <div className={internalClassName}> */}
      {/* <Group align='baseline'> */}

      <SimpleGrid
        breakpoints={[
          { maxWidth: 980, cols: 2, spacing: 'md' },
          { maxWidth: 755, cols: 2, spacing: 'sm' },
          { maxWidth: 600, cols: 1, spacing: 'sm' },
        ]}
        mb={10}
        cols={2}
      >
        {' '}
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
          </>
        )}
      </SimpleGrid>
      <div style={{ float: 'right' }}>{clearButtonNode}</div>

      {/* </div> */}
    </>
  )
}
