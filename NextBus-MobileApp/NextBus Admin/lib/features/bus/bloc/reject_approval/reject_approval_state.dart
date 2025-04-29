part of 'reject_approval_bloc.dart';

abstract class RejectApprovalState extends Equatable {
  const RejectApprovalState();

  @override
  List<Object> get props => [];
}

class RejectApprovalInitial extends RejectApprovalState {}

class RejectApprovalLoading extends RejectApprovalState {}

class RejectApprovalSuccess extends RejectApprovalState {
  final BusEntity bus;

  const RejectApprovalSuccess(this.bus);

  @override
  List<Object> get props => [bus];
}

class RejectApprovalFailure extends RejectApprovalState {
  final String message;

  const RejectApprovalFailure(this.message);

  @override
  List<Object> get props => [message];
}
