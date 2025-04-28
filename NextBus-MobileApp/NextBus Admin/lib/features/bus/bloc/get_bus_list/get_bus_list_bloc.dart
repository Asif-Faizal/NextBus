import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../data/bus_request_model.dart';
import '../../domain/bus_entity.dart';
import '../../domain/get_buses.dart';

part 'get_bus_list_event.dart';
part 'get_bus_list_state.dart';

class GetBusListBloc extends Bloc<GetBusListEvent, GetBusListState> {
  final GetBusesUseCase getBusesUseCase;
  int _currentPage = 1;
  int _totalPages = 1;
  String _busType = '';
  String _busSubType = '';
  String _busName = '';
  
  GetBusListBloc({required this.getBusesUseCase}) : super(GetBusListInitial()) {
    on<FetchBuses>((event, emit) async {
      // Save the filter parameters
      _busType = event.request.busType;
      _busSubType = event.request.busSubType;
      _busName = event.request.busName;
      
      if (event.request.page == 1) {
        emit(GetBusListLoading(
          busType: _busType,
          busSubType: _busSubType,
          busName: _busName,
        ));
      } else {
        final currentState = state as GetBusListLoaded;
        emit(GetBusListLoading(
          buses: currentState.buses,
          busType: _busType,
          busSubType: _busSubType,
          busName: _busName,
        ));
      }
      
      final result = await getBusesUseCase(event.request);
      result.fold(
        (error) => emit(GetBusListError(
          error.toString(),
          busType: _busType,
          busSubType: _busSubType,
          busName: _busName,
        )),
        (response) {
          _currentPage = response.page;
          _totalPages = response.totalPages;
          
          final hasMore = _currentPage < _totalPages;
          
          emit(GetBusListLoaded(
            response.data,
            currentPage: _currentPage,
            totalPages: _totalPages,
            hasMore: hasMore,
            busType: _busType,
            busSubType: _busSubType,
            busName: _busName,
          ));
        },
      );
    });
  }
  
  // Getters for the current filter values
  String get busType => _busType;
  String get busSubType => _busSubType;
  String get busName => _busName;
}
