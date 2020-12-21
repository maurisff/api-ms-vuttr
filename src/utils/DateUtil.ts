import moment from 'moment'
export default class DateUtil {
  public static trunc (value: Date): Date {
    return new Date(value.setHours(0, 0, 0, 0))
  }

  public static truncCeil (value: Date): Date {
    return new Date(value.setHours(24, 0, 0, 0))
  }

  public static addDays (value: Date, days:number = 1): Date {
    return new Date(value.setDate(value.getDate() + days))
  }

  public static stringFormatt (value: Date, mask:string = 'YYYY-MM-DD HH:mm:ss'): string {
    return moment(value).format(mask)
  }

  public static isEquals (value: Date, value2: Date): boolean {
    return moment(value).isSame(value2)
  }

  public static isEqualsDay (value: Date, value2: Date): boolean {
    return moment(this.trunc(value)).isSame(this.trunc(value2))
  }
}
