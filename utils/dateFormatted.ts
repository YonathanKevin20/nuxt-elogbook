const dayjs = useDayjs()

const dateFormatted = (datetime: string) => {
  if (!datetime) return ''
  return dayjs(datetime).format('dddd, D MMMM YYYY')
}

export default dateFormatted
