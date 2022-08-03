export class ServerSourceConf {
    constructor({ endPoint = '', sortFieldKey = '', sortDirKey = '', pagerPageKey = '', pagerLimitKey = '', filterFieldKey = '', totalKey = '', dataKey = '' } = {}) {
        this.endPoint = endPoint ? endPoint : '';
        this.sortFieldKey = sortFieldKey ? sortFieldKey : ServerSourceConf.SORT_FIELD_KEY;
        this.sortDirKey = sortDirKey ? sortDirKey : ServerSourceConf.SORT_DIR_KEY;
        this.pagerPageKey = pagerPageKey ? pagerPageKey : ServerSourceConf.PAGER_PAGE_KEY;
        this.pagerLimitKey = pagerLimitKey ? pagerLimitKey : ServerSourceConf.PAGER_LIMIT_KEY;
        this.filterFieldKey = filterFieldKey ? filterFieldKey : ServerSourceConf.FILTER_FIELD_KEY;
        this.totalKey = totalKey ? totalKey : ServerSourceConf.TOTAL_KEY;
        this.dataKey = dataKey ? dataKey : ServerSourceConf.DATA_KEY;
    }
}
ServerSourceConf.SORT_FIELD_KEY = '_sort';
ServerSourceConf.SORT_DIR_KEY = '_order';
ServerSourceConf.PAGER_PAGE_KEY = '_page';
ServerSourceConf.PAGER_LIMIT_KEY = '_limit';
ServerSourceConf.FILTER_FIELD_KEY = '#field#_like';
ServerSourceConf.TOTAL_KEY = 'x-total-count';
ServerSourceConf.DATA_KEY = '';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLXNvdXJjZS5jb25mLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9tdXVzbWFuL1dvcmsvbmcyLXNtYXJ0LXRhYmxlL3Byb2plY3RzL25nMi1zbWFydC10YWJsZS9zcmMvIiwic291cmNlcyI6WyJsaWIvbGliL2RhdGEtc291cmNlL3NlcnZlci9zZXJ2ZXItc291cmNlLmNvbmYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxPQUFPLGdCQUFnQjtJQW9CM0IsWUFDRSxFQUFFLFFBQVEsR0FBRyxFQUFFLEVBQUUsWUFBWSxHQUFHLEVBQUUsRUFBRSxVQUFVLEdBQUcsRUFBRSxFQUNqRCxZQUFZLEdBQUcsRUFBRSxFQUFFLGFBQWEsR0FBRyxFQUFFLEVBQUUsY0FBYyxHQUFHLEVBQUUsRUFBRSxRQUFRLEdBQUcsRUFBRSxFQUFFLE9BQU8sR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFO1FBRWhHLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUV6QyxJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUM7UUFDbEYsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDO1FBQzFFLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQztRQUNsRixJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUM7UUFDdEYsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUM7UUFDMUYsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztJQUMvRCxDQUFDOztBQS9CeUIsK0JBQWMsR0FBRyxPQUFPLENBQUM7QUFDekIsNkJBQVksR0FBRyxRQUFRLENBQUM7QUFDeEIsK0JBQWMsR0FBRyxPQUFPLENBQUM7QUFDekIsZ0NBQWUsR0FBRyxRQUFRLENBQUM7QUFDM0IsaUNBQWdCLEdBQUcsY0FBYyxDQUFDO0FBQ2xDLDBCQUFTLEdBQUcsZUFBZSxDQUFDO0FBQzVCLHlCQUFRLEdBQUcsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIFNlcnZlclNvdXJjZUNvbmYge1xuXG4gIHByb3RlY3RlZCBzdGF0aWMgcmVhZG9ubHkgU09SVF9GSUVMRF9LRVkgPSAnX3NvcnQnO1xuICBwcm90ZWN0ZWQgc3RhdGljIHJlYWRvbmx5IFNPUlRfRElSX0tFWSA9ICdfb3JkZXInO1xuICBwcm90ZWN0ZWQgc3RhdGljIHJlYWRvbmx5IFBBR0VSX1BBR0VfS0VZID0gJ19wYWdlJztcbiAgcHJvdGVjdGVkIHN0YXRpYyByZWFkb25seSBQQUdFUl9MSU1JVF9LRVkgPSAnX2xpbWl0JztcbiAgcHJvdGVjdGVkIHN0YXRpYyByZWFkb25seSBGSUxURVJfRklFTERfS0VZID0gJyNmaWVsZCNfbGlrZSc7XG4gIHByb3RlY3RlZCBzdGF0aWMgcmVhZG9ubHkgVE9UQUxfS0VZID0gJ3gtdG90YWwtY291bnQnO1xuICBwcm90ZWN0ZWQgc3RhdGljIHJlYWRvbmx5IERBVEFfS0VZID0gJyc7XG5cbiAgZW5kUG9pbnQ6IHN0cmluZztcblxuICBzb3J0RmllbGRLZXk6IHN0cmluZztcbiAgc29ydERpcktleTogc3RyaW5nO1xuICBwYWdlclBhZ2VLZXk6IHN0cmluZztcbiAgcGFnZXJMaW1pdEtleTogc3RyaW5nO1xuICBmaWx0ZXJGaWVsZEtleTogc3RyaW5nO1xuICB0b3RhbEtleTogc3RyaW5nO1xuICBkYXRhS2V5OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgeyBlbmRQb2ludCA9ICcnLCBzb3J0RmllbGRLZXkgPSAnJywgc29ydERpcktleSA9ICcnLFxuICAgICAgcGFnZXJQYWdlS2V5ID0gJycsIHBhZ2VyTGltaXRLZXkgPSAnJywgZmlsdGVyRmllbGRLZXkgPSAnJywgdG90YWxLZXkgPSAnJywgZGF0YUtleSA9ICcnIH0gPSB7fSkge1xuXG4gICAgdGhpcy5lbmRQb2ludCA9IGVuZFBvaW50ID8gZW5kUG9pbnQgOiAnJztcblxuICAgIHRoaXMuc29ydEZpZWxkS2V5ID0gc29ydEZpZWxkS2V5ID8gc29ydEZpZWxkS2V5IDogU2VydmVyU291cmNlQ29uZi5TT1JUX0ZJRUxEX0tFWTtcbiAgICB0aGlzLnNvcnREaXJLZXkgPSBzb3J0RGlyS2V5ID8gc29ydERpcktleSA6IFNlcnZlclNvdXJjZUNvbmYuU09SVF9ESVJfS0VZO1xuICAgIHRoaXMucGFnZXJQYWdlS2V5ID0gcGFnZXJQYWdlS2V5ID8gcGFnZXJQYWdlS2V5IDogU2VydmVyU291cmNlQ29uZi5QQUdFUl9QQUdFX0tFWTtcbiAgICB0aGlzLnBhZ2VyTGltaXRLZXkgPSBwYWdlckxpbWl0S2V5ID8gcGFnZXJMaW1pdEtleSA6IFNlcnZlclNvdXJjZUNvbmYuUEFHRVJfTElNSVRfS0VZO1xuICAgIHRoaXMuZmlsdGVyRmllbGRLZXkgPSBmaWx0ZXJGaWVsZEtleSA/IGZpbHRlckZpZWxkS2V5IDogU2VydmVyU291cmNlQ29uZi5GSUxURVJfRklFTERfS0VZO1xuICAgIHRoaXMudG90YWxLZXkgPSB0b3RhbEtleSA/IHRvdGFsS2V5IDogU2VydmVyU291cmNlQ29uZi5UT1RBTF9LRVk7XG4gICAgdGhpcy5kYXRhS2V5ID0gZGF0YUtleSA/IGRhdGFLZXkgOiBTZXJ2ZXJTb3VyY2VDb25mLkRBVEFfS0VZO1xuICB9XG59XG4iXX0=