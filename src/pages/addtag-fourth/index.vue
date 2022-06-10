<el-button
  type="primary"
  size="mini"
  @click="handleAdd('新增')">新增
</el-button>

<i class="el-icon-edit" @click="handleEdit('编辑')"></i>
<i class="el-icon-document" @click="handleEdit('详情')"></i>
<el-dialog
  :title="operationType"
  v-model="dialogVisible"
  :destroy-on-close="true"
  :visible.sync="dialogVisible"
  width="73%"
  top="5%"
  :before-close="handleClose"
>

<good v-if="dialogVisible" :operation-type="operationType" :operation-code="operationCode"
      @hideDialog="hideDialog()"/>
</el-dialog>
