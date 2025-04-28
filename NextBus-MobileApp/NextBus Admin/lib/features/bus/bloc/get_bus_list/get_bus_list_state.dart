part of 'get_bus_list_bloc.dart';

abstract class GetBusListState extends Equatable {
  const GetBusListState();

  @override
  List<Object?> get props => [];
}

class GetBusListInitial extends GetBusListState {}

class GetBusListLoading extends GetBusListState {
  final List<BusEntity> buses;
  final String busType;
  final String busSubType;
  final String busName;

  const GetBusListLoading({
    this.buses = const [],
    this.busType = '',
    this.busSubType = '',
    this.busName = '',
  });

  @override
  List<Object?> get props => [buses, busType, busSubType, busName];
}

class GetBusListLoaded extends GetBusListState {
  final List<BusEntity> buses;
  final int currentPage;
  final int totalPages;
  final bool hasMore;
  final String busType;
  final String busSubType;
  final String busName;

  const GetBusListLoaded(
    this.buses, {
    this.currentPage = 1,
    this.totalPages = 1,
    this.hasMore = true,
    this.busType = '',
    this.busSubType = '',
    this.busName = '',
  });

  @override
  List<Object?> get props => [buses, currentPage, totalPages, hasMore, busType, busSubType, busName];
}

class GetBusListError extends GetBusListState {
  final String message;
  final String busType;
  final String busSubType;
  final String busName;

  const GetBusListError(
    this.message, {
    this.busType = '',
    this.busSubType = '',
    this.busName = '',
  });

  @override
  List<Object?> get props => [message, busType, busSubType, busName];
}