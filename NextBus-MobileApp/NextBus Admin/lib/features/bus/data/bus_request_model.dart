import 'package:equatable/equatable.dart';

class BusListRequestModel extends Equatable {
  final String busType;
  final String busSubType;
  final String busName;
  final int page;
  final int limit;

  const BusListRequestModel({
    required this.busType,
    required this.busSubType,
    required this.busName,
    required this.page,
    required this.limit,
  });

  Map<String, String> toQueryParameters() => {
        'busType': busType,
        'busSubType': busSubType,
        'busName': busName,
        'page': page.toString(),
        'limit': limit.toString(),
      };

  @override
  List<Object?> get props => [busType, busSubType, busName, page, limit];
}