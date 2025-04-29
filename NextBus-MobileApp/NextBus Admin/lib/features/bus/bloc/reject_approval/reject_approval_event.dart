part of 'reject_approval_bloc.dart';

abstract class RejectApprovalEvent extends Equatable {
  const RejectApprovalEvent();

  @override
  List<Object> get props => [];
}

class RejectApproval extends RejectApprovalEvent {
  final String id;

  const RejectApproval({required this.id});

  @override
  List<Object> get props => [id];
}
