define('summernote/module/Dialog', function () {
  /**
   * Dialog 
   *
   * @class
   */
  var Dialog = function () {

    /**
     * toggle button status
     *
     * @param {jQuery} $btn
     * @param {Boolean} bEnable
     */
    var toggleBtn = function ($btn, bEnable) {
      $btn.toggleClass('disabled', !bEnable);
      $btn.attr('disabled', !bEnable);
    };

    /**
     * show image dialog
     *
     * @param {jQuery} $editable
     * @param {jQuery} $dialog
     * @return {Promise}
     */
    this.showImageDialog = function ($editable, $dialog) {
      return $.Deferred(function (deferred) {
        var $imageDialog = $dialog.find('.note-image-dialog');

        var $imageInput = $dialog.find('.note-image-input'),
            $imageUrl = $dialog.find('.note-image-url'),
            $imageBtn = $dialog.find('.note-image-btn');

        $imageDialog.one('shown.bs.modal', function () {
          // Cloning imageInput to clear element.
          $imageInput.replaceWith($imageInput.clone()
            .on('change', function () {
              deferred.resolve(this.files);
              $imageDialog.modal('hide');
            })
          );

          $imageBtn.click(function (event) {
            event.preventDefault();

            deferred.resolve($imageUrl.val());
            $imageDialog.modal('hide');
          });

          $imageUrl.keyup(function () {
            toggleBtn($imageBtn, $imageUrl.val());
          }).val('').trigger('focus');
        }).one('hidden.bs.modal', function () {
          $imageInput.off('change');
          $imageUrl.off('keyup');
          $imageBtn.off('click');

          if (deferred.state() === 'pending') {
            deferred.reject();
          }
        }).modal('show');
      });
    };

    /**
     * Show video dialog and set event handlers on dialog controls.
     *
     * @param {jQuery} $dialog 
     * @param {Object} videoInfo 
     * @return {Promise}
     */
    this.showVideoDialog = function ($editable, $dialog, videoInfo) {
      return $.Deferred(function (deferred) {
        var $videoDialog = $dialog.find('.note-video-dialog');
        var $videoUrl = $videoDialog.find('.note-video-url'),
            $videoBtn = $videoDialog.find('.note-video-btn');

        $videoDialog.one('shown.bs.modal', function () {
          $videoUrl.val(videoInfo.text).keyup(function () {
            toggleBtn($videoBtn, $videoUrl.val());
          }).trigger('keyup').trigger('focus');

          $videoBtn.click(function (event) {
            event.preventDefault();

            deferred.resolve($videoUrl.val());
            $videoDialog.modal('hide');
          });
        }).one('hidden.bs.modal', function () {
          $videoUrl.off('keyup');
          $videoBtn.off('click');

          if (deferred.state() === 'pending') {
            deferred.reject();
          }
        }).modal('show');
      });
    };

    /**
     * Show link dialog and set event handlers on dialog controls.
     *
     * @param {jQuery} $dialog
     * @param {Object} linkInfo
     * @return {Promise}
     */
    this.showLinkDialog = function ($editable, $dialog, linkInfo) {
      return $.Deferred(function (deferred) {
        var $linkDialog = $dialog.find('.note-link-dialog');

        var $linkText = $linkDialog.find('.note-link-text'),
        $linkUrl = $linkDialog.find('.note-link-url'),
        $linkBtn = $linkDialog.find('.note-link-btn'),
        $openInNewWindow = $linkDialog.find('input[type=checkbox]');

        $linkDialog.one('shown.bs.modal', function () {
          $linkText.val(linkInfo.text);

          $linkText.keyup(function () {
            // if linktext was modified by keyup,
            // stop cloning text from linkUrl
            linkInfo.text = $linkText.val();
          });

          // if no url was given, copy text to url
          if (!linkInfo.url) {
            linkInfo.url = linkInfo.text;
            toggleBtn($linkBtn, linkInfo.text);
          }

          $linkUrl.keyup(function () {
            toggleBtn($linkBtn, $linkUrl.val());
            // display same link on `Text to display` input
            // when create a new link
            if (!linkInfo.text) {
              $linkText.val($linkUrl.val());
            }
          }).val(linkInfo.url).trigger('focus').trigger('select');

          $openInNewWindow.prop('checked', linkInfo.newWindow);

          $linkBtn.one('click', function (event) {
            event.preventDefault();

            deferred.resolve($linkText.val(), $linkUrl.val(), $openInNewWindow.is(':checked'));
            $linkDialog.modal('hide');
          });
        }).one('hidden.bs.modal', function () {
          $linkUrl.off('keyup');

          if (deferred.state() === 'pending') {
            deferred.reject();
          }
        }).modal('show');
      }).promise();
    };

    /**
     * Show paste from word dialog and set event handlers on dialog controls.
     *
     * @param {jQuery} $dialog
     * @return {Promise}
     */
    this.showPasteWordDialog = function ($editable, $dialog) {
      return $.Deferred(function (deferred) {
        var $pasteWordDialog = $dialog.find('.note-pasteword-dialog');

        var $pasteWordText = $pasteWordDialog.find('.note-pasteword-text'),
          $pasteWordBtn = $pasteWordDialog.find('.note-pasteword-btn');

        $pasteWordDialog.one('shown.bs.modal', function () {

          $pasteWordText.keyup(function () {
            toggleBtn($pasteWordBtn, $pasteWordText.val());
          }).trigger('focus').trigger('select');

          $pasteWordBtn.one('click', function (event) {
            event.preventDefault();

            deferred.resolve($pasteWordText.val());
            $pasteWordDialog.modal('hide');
            $pasteWordText.val('');
          });
        }).one('hidden.bs.modal', function () {
          $pasteWordText.off('keyup');

          if (deferred.state() === 'pending') {
            deferred.reject();
          }
        }).modal('show');
      }).promise();
    };

    /**
     * show help dialog
     *
     * @param {jQuery} $dialog
     */
    this.showHelpDialog = function ($editable, $dialog) {
      return $.Deferred(function (deferred) {
        var $helpDialog = $dialog.find('.note-help-dialog');

        $helpDialog.one('hidden.bs.modal', function () {
          deferred.resolve();
        }).modal('show');
      }).promise();
    };
  };

  return Dialog;
});
